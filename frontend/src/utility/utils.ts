/** Returns time differenc in hh:mm:ss format. */
export function timeDiff(startTime: string, endTime: string) {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const secNum = (end - start) / 1000;
  const hours = Math.floor(secNum / 3600);
  const minutes = Math.floor((secNum - (hours * 3600)) / 60);
  const seconds = Math.floor(secNum - (hours * 3600) - (minutes * 60));

  const hoursStr = `0${hours}`.slice(-2);
  const minutesStr = `0${minutes}`.slice(-2);
  const secondsStr = `0${seconds}`.slice(-2);

  return `${hoursStr}:${minutesStr}:${secondsStr}`;
}
