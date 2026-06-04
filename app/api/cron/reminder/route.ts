import { NextResponse } from 'next/server';
import { runReminderJob } from '@/lib/event/reminder';

export async function GET() {
  console.log('/api/cron/reminder 有跑排程');
  await runReminderJob();
  return NextResponse.json({ ok: true });
}
