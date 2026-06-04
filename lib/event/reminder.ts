import { supabase } from '@/lib/supabase';
import { pushToGroup } from '@/app/api/line/push';
import { EVENT_SELECT } from '@/lib/constants/eventSelect';
import { EventViewModel } from '@/lib/types/event';
import { mapEvent } from '@/lib/mappers/eventMapper';

export function buildReminderMessage(data: EventViewModel, type: '3d' | '1d') {
  const prefix =
    type === '3d' ? '📅【活動提醒】3天後有活動' : '⚠️【活動提醒】明天有活動';

  const usersNames =
    data.users?.length > 0 ? data.users.map((u) => u.name).join('、') : '無';

  return `
${prefix}

🏷️ ${data.title}

🕒 活動時間：${data.timeLabel}

📍 活動地點：${data.location.name}
👤 預約人：${data.bookedBy.name}
👥 參與者：${usersNames}

📝 備註：${data.notes?.trim() || '無'}

🗺️ 地圖：${data.location.mapUrl || '無'}
`.trim();
}

/**
 * Event reminder job
 * - Runs every X minutes via cron
 * - Sends LINE reminders for:
 *   1) 3 days before event
 *   2) 1 day before event
 */

// for test
// export async function runReminderJob() {
//   try {
//     console.log('有跑runReminderJob');
//     await pushToGroup(process.env.NEXT_PUBLIC_LINE_MY_GROUP_ID, '手動測試傳送通知');
//     console.log('成功傳送');
//     return {
//       success: true,
//     };
//   } catch (e) {
//     console.log(e);
//     throw e;
//   }
// }

export async function runReminderJob() {
  const now = new Date();

  /**
   * =========================
   * 1. Helper: build time range
   * =========================
   * We use a small time window (±10 min)
   * to avoid missing events due to cron timing drift.
   */
  // const buildReminderWindow = (daysAhead: number) => {
  //   const start = new Date(now);
  //   start.setDate(now.getDate() + daysAhead);

  //   const end = new Date(start);
  //   end.setMinutes(start.getMinutes() + 10);

  //   return { start, end };
  // };

  // for test 3min and 1min before
  const buildReminderWindow = (minutesBefore: number) => {
    const now = new Date();

    const start = new Date(
      now.getTime() + minutesBefore * 60 * 1000 - 1 * 60 * 1000,
    );
    const end = new Date(
      now.getTime() + minutesBefore * 60 * 1000 + 1 * 60 * 1000,
    );

    return { start, end };
  };

  /**
   * =========================
   * 2. 3-day reminders
   * =========================
   */
  const { start: start3, end: end3 } = buildReminderWindow(3);

  console.log('NOW:', now.toISOString());
  console.log('START:', start3.toISOString());
  console.log('END:', end3.toISOString());

  const { data: events3, error: error3 } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .eq('reminder_3d_sent', false)
    .gte('event_time', start3.toISOString())
    .lte('event_time', end3.toISOString());

  console.log(events3);
  if (error3) {
    console.error('3-day reminder query error:', error3);
  }

  /**
   * =========================
   * 3. 1-day reminders
   * =========================
   */
  const { start: start1, end: end1 } = buildReminderWindow(1);

  const { data: events1, error: error1 } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .eq('reminder_1d_sent', false)
    .gte('event_time', start1.toISOString())
    .lte('event_time', end1.toISOString());

  console.log(events1);
  if (error1) {
    console.error('1-day reminder query error:', error1);
  }

  /**
   * =========================
   * 4. Send 3-day reminders
   * =========================
   */
  for (const event of events3 ?? []) {
    console.log('events3:');
    console.log(event);
    const eventData = mapEvent(event);
    try {
      await pushToGroup(
        eventData.lineGroupId,
        buildReminderMessage(eventData, '3d'),
      );

      await supabase
        .from('events')
        .update({ reminder_3d_sent: true })
        .eq('id', eventData.id);
    } catch (err) {
      console.error('Failed 3-day reminder:', eventData.id, err);
    }
  }

  /**
   * =========================
   * 5. Send 1-day reminders
   * =========================
   */
  for (const event of events1 ?? []) {
    console.log('events1:');
    console.log(event);
    const eventData = mapEvent(event);
    try {
      await pushToGroup(
        eventData.lineGroupId,
        buildReminderMessage(eventData, '1d'),
      );

      await supabase
        .from('events')
        .update({ reminder_1d_sent: true })
        .eq('id', eventData.id);
    } catch (err) {
      console.error('Failed 1-day reminder:', eventData.id, err);
    }
  }

  console.log('events3:', events3?.length);
  console.log('events1:', events1?.length);
  /**
   * =========================
   * 6. Return summary
   * =========================
   */
  return {
    success: true,
    sent3Day: events3?.length ?? 0,
    sent1Day: events1?.length ?? 0,
  };
}
