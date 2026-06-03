export function formatEventTimeToTimeLabel(
  isoString: string,
  durationHours: number,
): string {
  const date = new Date(isoString);

  // ⚠️ 台灣時間 (可改 timezone)
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Taipei',
  };

  const year = date.toLocaleString('zh-TW', {
    ...options,
    year: 'numeric',
  });

  const month = date.toLocaleString('zh-TW', {
    ...options,
    month: '2-digit',
  });

  const day = date.toLocaleString('zh-TW', {
    ...options,
    day: '2-digit',
  });

  const weekday = new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Asia/Taipei',
    weekday: 'long',
  }).format(date);

  const startHour = new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Asia/Taipei',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);

  // ➜ 計算結束時間
  const endDate = new Date(date);
  endDate.setHours(endDate.getHours() + durationHours);

  const endHour = new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Asia/Taipei',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(endDate);

  return `${year}${month}${day}（${weekday}）${startHour}-${endHour}`;
}
