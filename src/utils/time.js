function prependZero(number) {
  return number < 10 ? `0${number}` : number;
}

/**
 * Transforms seconds to mm:ss format
 * @param absoluteSeconds
 * @returns {string}
 */
export function formatSeconds(absoluteSeconds) {
  let minutes = prependZero(Math.floor(absoluteSeconds / 60));
  let seconds = absoluteSeconds % 60;
  let remainedSeconds = prependZero(seconds);
  return `${minutes}:${remainedSeconds}`;
}