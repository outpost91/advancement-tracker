export function urlB64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export function formatDate(date: any) {
  let _date: string;

  if (typeof date === 'string') {
    _date = date.split('T')[0];
  } else {
    let year;
    let month;
    let day;
    year = date
              .year
              .value
              .toString()
              .padStart(4, '0');
    month = date
              .month
              .value
              .toString()
              .padStart(2, '0');
    day = date
              .day
              .value
              .toString()
              .padStart(2, '0');
    _date = year + '-' + month + '-' + day;
  }

  return _date;
}
