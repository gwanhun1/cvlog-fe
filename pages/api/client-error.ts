import type { NextApiRequest, NextApiResponse } from 'next';

type ClientErrorPayload = {
  message?: string;
  stack?: string;
  source?: string;
  lineno?: number;
  colno?: number;
  pathname?: string;
  href?: string;
  userAgent?: string;
  timestamp?: number;
  type?: 'error' | 'unhandledrejection';
  reason?: unknown;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }

  const body = (req.body ?? {}) as ClientErrorPayload;

  console.error('[client-error]', {
    ...body,
    timestamp: body.timestamp ?? Date.now(),
  });

  return res.status(200).json({ ok: true });
}
