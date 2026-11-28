import { HttpException, HttpStatus } from '@nestjs/common';
import { NextResponse } from 'next/server';

export class TooManyRequestsException extends HttpException {
  constructor(message = 'Too many requests. Please wait a moment and try again.', retryAfterSeconds = 60) {
    super(
      {
        code: 'TOO_MANY_REQUESTS',
        message,
        retryAfterSeconds,
      },
      HttpStatus.TOO_MANY_REQUESTS
    );
  }
}

export function getClientIp(request) {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0].trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

export function getUserAgent(request) {
  return (request.headers.get('user-agent') || '').slice(0, 255);
}

export function formatExceptionResponse(err) {
  if (err instanceof HttpException) {
    const status = err.getStatus();
    const resp = err.getResponse();
    let code = 'AUTH_ERROR';
    let message = 'Request could not be completed.';
    let details;
    let extraHeaders = {};

    if (typeof resp === 'string') {
      message = resp;
    } else if (resp && typeof resp === 'object') {
      code = resp.code || codeFromStatus(status);
      message = Array.isArray(resp.message)
        ? resp.message[0]
        : resp.message || message;
      if (resp.details !== undefined) details = resp.details;
      if (resp.retryAfterSeconds) {
        extraHeaders['Retry-After'] = String(resp.retryAfterSeconds);
      }
      if (resp.remainingAttempts !== undefined) {
        details = { ...(details || {}), remainingAttempts: resp.remainingAttempts };
      }
    }

    const body = {
      ok: false,
      error: {
        code,
        message,
        ...(details !== undefined ? { details } : {}),
      },
    };
    return NextResponse.json(body, {
      status,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        ...extraHeaders,
      },
    });
  }

  // Never leak stack traces or internal DB details to clients
  if (process.env.NODE_ENV !== 'production') {
    console.error('[ZYRO Auth Error]', err?.message || err);
  }
  return NextResponse.json(
    {
      ok: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong while processing your request. Please try again.',
      },
    },
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    }
  );
}

function codeFromStatus(status) {
  switch (status) {
    case 400:
      return 'VALIDATION_ERROR';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    case 429:
      return 'TOO_MANY_REQUESTS';
    default:
      return 'SERVER_ERROR';
  }
}

export async function parseJsonBody(request) {
  try {
    const raw = await request.text();
    if (!raw || !raw.trim()) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new HttpException(
        { code: 'INVALID_JSON', message: 'Request body must be a JSON object.' },
        HttpStatus.BAD_REQUEST
      );
    }
    return parsed;
  } catch (err) {
    if (err instanceof HttpException) throw err;
    throw new HttpException(
      { code: 'INVALID_JSON', message: 'Invalid JSON request body.' },
      HttpStatus.BAD_REQUEST
    );
  }
}
