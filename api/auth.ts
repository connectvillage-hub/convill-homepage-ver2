import type { VercelRequest, VercelResponse } from '@vercel/node';

// GitHub OAuth 진입점.
// Decap CMS의 admin UI에서 "Login with GitHub" 클릭 시 이 엔드포인트로 들어옴.
// 여기서 GitHub OAuth consent 페이지로 리디렉트하고, GitHub은 사용자 승인 후 /api/callback으로 돌려보냄.

export default function handler(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    res.status(500).send('Missing env var: OAUTH_GITHUB_CLIENT_ID');
    return;
  }

  const host = req.headers.host;
  const proto = (req.headers['x-forwarded-proto'] as string | undefined) ?? 'https';
  const redirectUri = `${proto}://${host}/api/callback`;

  // GitHub 권한 범위. repo = private repo 포함 콘텐츠 read/write, user = 로그인 사용자 정보.
  const scope = 'repo,user';

  // CSRF 완화용 랜덤 state. 동일 origin 안에서 popup ↔ opener 통신만 하므로
  // 엄격한 state 검증 대신 GitHub→callback 1회 패스의 사실상 무결성에 의존.
  const state = Math.random().toString(36).slice(2);

  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('state', state);

  res.redirect(302, authUrl.toString());
}
