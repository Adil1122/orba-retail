import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AuthController } from './auth/auth.controller.js';
import { AuthModule } from './auth/auth.module.js';

const CONTEXT_KEY = '__zyroServerlessNestContextPromise';

/**
 * Lazily initializes and caches a serverless NestJS ApplicationContext (DI container only,
 * no persistent HTTP/Express listener) so Next.js App Router API routes invoke NestJS
 * modules, controllers, services, and guards natively on Vercel Serverless Functions.
 */
export async function getNestContext() {
  if (!globalThis[CONTEXT_KEY]) {
    globalThis[CONTEXT_KEY] = NestFactory.createApplicationContext(AuthModule, {
      logger: false,
    }).catch((err) => {
      globalThis[CONTEXT_KEY] = null;
      throw err;
    });
  }
  return globalThis[CONTEXT_KEY];
}

export async function getAuthController() {
  const ctx = await getNestContext();
  return ctx.get(AuthController);
}
