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

const isWithinDayRange = (eventTime: string, daysBefore: number) => {
  const now = new Date();
  const event = new Date(eventTime);

  const diffMs = event.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays <= daysBefore && diffDays > daysBefore - 1;
};

export async function runReminderJob() {
  const now = new Date();

  const future = new Date();
  future.setDate(now.getDate() + 3);

  // const buildReminderWindow = (daysAhead: number) => {
  //   const start = new Date(now);
  //   start.setDate(now.getDate() + daysAhead);

  //   const end = new Date(start);
  //   end.setMinutes(start.getMinutes() + 10);

  //   return { start, end };
  // };

  const { data: eventsRaw } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .gte('event_time', now.toISOString())
    .lte('event_time', future.toISOString());

  const events = eventsRaw?.map((ev) => mapEvent(ev));

  for (const event of events ?? []) {
    // 3 days before
    if (!event.reminder3dSent && isWithinDayRange(event.eventTime, 3)) {
      await pushToGroup(event.lineGroupId, buildReminderMessage(event, '3d'));

      await supabase
        .from('events')
        .update({ reminder_3d_sent: true })
        .eq('id', event.id);
    }

    // 1 day before
    if (!event.reminder1dSent && isWithinDayRange(event.eventTime, 1)) {
      await pushToGroup(event.lineGroupId, buildReminderMessage(event, '1d'));

      await supabase
        .from('events')
        .update({ reminder_1d_sent: true })
        .eq('id', event.id);
    }
  }

  return {
    success: true,
    checked: events?.length ?? 0,
  };

  // const { start: start3, end: end3 } = buildReminderWindow(3);

  // const { data: events3, error: error3 } = await supabase
  //   .from('events')
  //   .select(EVENT_SELECT)
  //   .eq('reminder_3d_sent', false)
  //   .gte('event_time', start3.toISOString())
  //   .lte('event_time', end3.toISOString());

  // console.log(events3);
  // if (error3) {
  //   console.error('3-day reminder query error:', error3);
  // }

  // const { start: start1, end: end1 } = buildReminderWindow(1);

  // const { data: events1, error: error1 } = await supabase
  //   .from('events')
  //   .select(EVENT_SELECT)
  //   .eq('reminder_1d_sent', false)
  //   .gte('event_time', start1.toISOString())
  //   .lte('event_time', end1.toISOString());

  // console.log(events1);
  // if (error1) {
  //   console.error('1-day reminder query error:', error1);
  // }

  // for (const event of events3 ?? []) {
  //   console.log('events3:');
  //   console.log(event);
  //   const eventData = mapEvent(event);
  //   try {
  //     await pushToGroup(
  //       eventData.lineGroupId,
  //       buildReminderMessage(eventData, '3d'),
  //     );

  //     await supabase
  //       .from('events')
  //       .update({ reminder_3d_sent: true })
  //       .eq('id', eventData.id);
  //   } catch (err) {
  //     console.error('Failed 3-day reminder:', eventData.id, err);
  //   }
  // }

  // for (const event of events1 ?? []) {
  //   console.log('events1:');
  //   console.log(event);
  //   const eventData = mapEvent(event);
  //   try {
  //     await pushToGroup(
  //       eventData.lineGroupId,
  //       buildReminderMessage(eventData, '1d'),
  //     );

  //     await supabase
  //       .from('events')
  //       .update({ reminder_1d_sent: true })
  //       .eq('id', eventData.id);
  //   } catch (err) {
  //     console.error('Failed 1-day reminder:', eventData.id, err);
  //   }
  // }

  // console.log('events3:', events3?.length);
  // console.log('events1:', events1?.length);

  // return {
  //   success: true,
  //   sent3Day: events3?.length ?? 0,
  //   sent1Day: events1?.length ?? 0,
  // };
}
