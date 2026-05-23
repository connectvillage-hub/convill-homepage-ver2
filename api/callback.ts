import type { VercelRequest, VercelResponse } from '@vercel/node';

// GitHub OAuth callback.
// 사용자가 GitHub에서 권한 승인 후 ?code=... 와 함께 여기로 돌아옴.
// 1) code를 access_token으로 교환
// 2) Decap CMS popup ↔ opener postMessage 프로토콜을 따라 토큰 전달
//    프로토콜: popup이 "authorizing:github" 송신 → opener가 응답 → popup이 "authorization:github:success:<JSON>" 송신

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    res.status(500).send('Missing env vars: OAUTH_GITHUB_CLIENT_ID / OAUTH_GITHUB_CLIENT_SECRET');
    return;
  }

  const code = req.query.code;
  if (typeof code !== 'string' || !code) {
    res.status(400).send('Missing ?code= query param');
    return;
  }

  let token: string | undefined;
  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });
    const data = (await tokenRes.json()) as { access_token?: string; error?: string; error_description?: string };
    if (data.error) {
      res.status(401).send(`GitHub error: ${data.error_description ?? data.error}`);
      return;
    }
    token = data.access_token;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    res.status(502).send(`Token exchange failed: ${msg}`);
    return;
  }

  if (!token) {
    res.status(401).send('No access_token returned from GitHub');
    return;
  }

  // postMessage 페이로드. Decap CMS는 정확히 이 포맷을 기다림.
  const payload = JSON.stringify({ token, provider: 'github' });
  const successMessage = `authorization:github:success:${payload}`;

  // HTML을 일반 문자열로 응답 (Vercel Function이 정적 페이지처럼 서빙).
  // popup 안에서 실행되어 opener(Decap CMS 어드민)로 토큰을 던지고 자동 닫힘.
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<title>Authenticating…</title>
<style>body{font-family:system-ui;padding:40px;text-align:center;color:#444;}</style>
</head>
<body>
<p>인증 완료. 잠시 후 자동으로 닫힙니다…</p>
<script>
(function() {
  function send() {
    if (!window.opener) {
      document.body.innerHTML += '<p style="color:#c00">opener 윈도우를 찾을 수 없습니다. 어드민 페이지에서 다시 시도해주세요.</p>';
      return;
    }
    function receiveMessage(e) {
      // opener가 응답하면 (e.origin가 opener의 origin), 토큰을 그 origin으로 전달
      window.opener.postMessage(${JSON.stringify(successMessage)}, e.origin);
      window.removeEventListener('message', receiveMessage, false);
      setTimeout(function() { window.close(); }, 500);
    }
    window.addEventListener('message', receiveMessage, false);
    // opener에게 "지금 인증 중" 신호. opener는 자기 origin을 담아서 응답함.
    window.opener.postMessage('authorizing:github', '*');
  }
  send();
})();
</script>
</body>
</html>`);
}
