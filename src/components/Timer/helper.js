import { COLORS } from "../../utils/common";
import { PlatformSpecific } from "../../utils/platformSpecific";
import { delay } from "../../utils/delay";

export const INTERVAL_KEYS = {
  SESSION: 'Session',
  BREAK: 'Break',
};

export const DEFAULT_DURATIONS = {
  [INTERVAL_KEYS.SESSION]: 3,
  [INTERVAL_KEYS.BREAK]: 2,
};

export function getInitialValue(key, intervalId) {
  switch (key) {
    case 'duration':
      return +getFromLocalStorage(key, intervalId);

    case 'endSound':
      return getFromLocalStorage(key, intervalId);

    case 'customBackground':
      return getFromLocalStorage(key);

    default:
      throw new Error(`Unexpected key=${key}`);
  }
}

function getFromLocalStorage(key, intervalId) {
  const storageKey = getStorageKey(key, intervalId);
  const fromStorage = window.localStorage.getItem(storageKey);
  if (fromStorage) {
    return fromStorage;
  }

  return getDefaultValue(key, intervalId);
}

export function deleteFromLocalStorage(key, intervalId) {
  const storageKey = getStorageKey(key, intervalId);
  window.localStorage.removeItem(storageKey);
}

export const PROGRESSBAR_SETTINGS = {
  options: {
    text: {
      className: 'timer__digits',
      alignToBottom: false
    },
    color: COLORS.Main,
    strokeWidth: 3,
    svgStyle: {
      display: 'block',
      width: '100%',
      transform: {
        prefix: true,
        value: 'scaleY(-1)'
      }
    }
  },
  containerStyle: {
    width: '275px',
  }
};

export function getStorageKey(key, intervalId) {
  if (!intervalId) {
    return key;
  }
  switch (key) {
    case 'duration':
      return `${intervalId}_duration`;

    case 'endSound':
      return `${intervalId}_sound`;

    default:
      throw new Error(`Unexpected key=${key}`);
  }
}

export function getDefaultValue(key, intervalId) {
  switch (key) {
    case 'duration':
      return DEFAULT_DURATIONS[intervalId];

    case 'endSound':
      return getDefaultSounds()[intervalId];

    case 'customBackground':
      return null;

    default:
      throw new Error(`Unexpected key=${key}`);
  }
}

function getDefaultSounds() {
  const appDir = PlatformSpecific.getAppDir();
  return {
    [INTERVAL_KEYS.SESSION]: appDir + 'audio/workEnd.wav',
    [INTERVAL_KEYS.BREAK]: appDir + 'audio/breakEnd.wav',
  };
}

export function playSound(src) {
  const sound = new Media(src);
  const durationMilliseconds = sound.getDuration() * 1000;

  sound.play(() => {
    delay(durationMilliseconds).then(() => {
      sound.stop();
      sound.release();
    })
  });

  return sound;
}