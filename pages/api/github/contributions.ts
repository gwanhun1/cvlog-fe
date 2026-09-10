import type { NextApiRequest, NextApiResponse } from 'next';
import { parseContributions } from 'utils/githubContributions';

const USERNAME_PATTERN = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }
  const { username, year = 'last' } = req.query;
  const currentYear = new Date().getUTCFullYear();
  if (typeof username !== 'string' || !USERNAME_PATTERN.test(username))
    return res.status(400).json({ message: 'Invalid GitHub username' });
  if (
    typeof year !== 'string' ||
    (year !== 'last' &&
      (!/^\d{4}$/.test(year) ||
        Number(year) < 2008 ||
        Number(year) > currentYear))
  )
    return res.status(400).json({ message: 'Invalid year' });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const url = new URL(
      `https://github.com/users/${encodeURIComponent(username)}/contributions`,
    );
    if (year !== 'last') {
      url.searchParams.set('from', `${year}-01-01`);
      url.searchParams.set('to', `${year}-12-31`);
    }
    const response = await fetch(url, {
      headers: {
        Accept: 'text/html',
        'Accept-Language': 'en-US',
        'User-Agent': 'LOGME-GitHub-Studio',
      },
      signal: controller.signal,
    });
    if (!response.ok)
      return res
        .status(response.status === 404 ? 404 : 502)
        .json({ message: 'GitHub request failed' });
    const today = new Date().toISOString().slice(0, 10);
    const days = parseContributions(await response.text()).filter(
      day =>
        day.date <= today && (year === 'last' || day.date.startsWith(year)),
    );
    if (!days.length)
      return res
        .status(502)
        .json({ message: 'Contribution graph unavailable' });
    res.setHeader(
      'Cache-Control',
      req.query.fresh === '1'
        ? 'no-store'
        : 'public, s-maxage=300, stale-while-revalidate=300',
    );
    return res
      .status(200)
      .json({
        total: days.reduce((sum, day) => sum + day.count, 0),
        days,
        fetchedAt: new Date().toISOString(),
      });
  } catch {
    return res.status(502).json({ message: 'Contribution graph unavailable' });
  } finally {
    clearTimeout(timeout);
  }
}
