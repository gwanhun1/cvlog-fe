import type { NextApiRequest, NextApiResponse } from 'next';

const USERNAME_PATTERN = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const username = Array.isArray(req.query.username)
    ? req.query.username[0]
    : req.query.username;

  if (!username || !USERNAME_PATTERN.test(username)) {
    return res.status(400).json({ message: 'Invalid GitHub username' });
  }

  try {
    const response = await fetch(
      `https://github.com/users/${encodeURIComponent(username)}/contributions`,
      { headers: { Accept: 'text/html', 'User-Agent': 'LOGME-GitHub-Studio' } },
    );

    if (!response.ok) return res.status(response.status).json({ message: 'GitHub request failed' });

    const html = await response.text();
    const days: { date: string; count: number; level: number }[] = [];
    const dayPattern = /data-date="([0-9-]+)"[^>]*data-level="([0-4])"[^>]*><\/td>\s*<tool-tip[^>]*>(?:([0-9,]+)|No) contributions?/g;
    let match: RegExpExecArray | null;

    while ((match = dayPattern.exec(html)) !== null) {
      days.push({
        date: match[1],
        level: Number(match[2]),
        count: match[3] ? Number(match[3].replace(/,/g, '')) : 0,
      });
    }

    if (!days.length) return res.status(502).json({ message: 'Contribution graph unavailable' });

    const totalMatch = html.match(/<h2[^>]*>[\s\n]*([0-9,]+)[\s\n]*contributions/);
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');
    return res.status(200).json({
      total: totalMatch ? Number(totalMatch[1].replace(/,/g, '')) : days.reduce((sum, day) => sum + day.count, 0),
      days: days.sort((a, b) => a.date.localeCompare(b.date)),
    });
  } catch {
    return res.status(502).json({ message: 'Contribution graph unavailable' });
  }
}
