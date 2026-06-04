import { NextResponse } from 'next/server';
import { runReminderJob } from '@/lib/event/reminder';

export async function GET() {
  await runReminderJob();
  return NextResponse.json({ ok: true });
}
