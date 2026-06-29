import { supabase } from '@/lib/supabase';
import { pushToGroup } from '@/app/api/line/push';
import { EVENT_SELECT } from '@/lib/constants/eventSelect';
import { EventViewModel } from '@/lib/types/event';
import { mapEvent } from '@/lib/mappers/eventMapper';

export function buildReminderMessage(
  data: EventViewModel,
  type: '3d' | '1d' | '0d',
) {
  if (type === '3d')
    return `@All 3 天後要練雙人瑜伽喔！詳細內容可於 https://acro-circle.vercel.app/ 瀏覽`;

  const prefix =
    type === '1d' ? '📅【活動提醒】明天有活動' : '⚠️【活動提醒】今天有活動';

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
`;
}

// for test
// export async function runReminderJob() {
//   try {
//     console.warn('go runReminderJob');
//     await pushToGroup(process.env.NEXT_PUBLIC_LINE_MY_GROUP_ID, 'send notification message in line group by me');
//     console.warn('done');
//     return {
//       success: true,
//     };
//   } catch (e) {
//     console.warn(e);
//     throw e;
//   }
// }

const isWithinDayRange = (eventTime: string, daysBefore: number) => {
  const event = new Date(eventTime);

  const start = new Date();
  start.setDate(start.getDate() + daysBefore);
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setDate(end.getDate() + daysBefore + 1);
  end.setHours(0, 0, 0, 0);

  return event >= start && event < end;
};

export async function runReminderJob() {
  const now = new Date();

  const past = new Date();
  past.setHours(now.getHours() - 12);

  const future = new Date();
  future.setDate(now.getDate() + 4);

  const { data: eventsRaw } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .gte('event_time', past.toISOString())
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

    // 0 day before
    if (!event.reminder0dSent && isWithinDayRange(event.eventTime, 0)) {
      await pushToGroup(event.lineGroupId, buildReminderMessage(event, '0d'));

      await supabase
        .from('events')
        .update({ reminder_0d_sent: true })
        .eq('id', event.id);
    }
  }

  return {
    success: true,
    checked: events?.length ?? 0,
  };
}
