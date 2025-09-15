export function Scheduler(timestamp, callback) {
  const now = Date.now();
  const delay = timestamp - now;

  if (delay <= 0) {
    callback();
    return null;
  }

  return setTimeout(callback, delay);
}
