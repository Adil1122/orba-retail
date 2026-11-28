import { getAuthController } from '@/server/nest-app.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const controller = await getAuthController();
  return controller.me(request);
}
