const PLATFORMS = {
  ios: 'iOS',
  android: 'Android',
};

export const PlatformSpecific = {
  getAppDir() {
    switch (window.device.platform) {
      case PLATFORMS.ios:
        return '';

      case PLATFORMS.android:
        return '/android_asset/www/';

      default:
        throw new Error('Unexpected window.device.platform');
    }
  },

  getRecordExtension() {
    switch (window.device.platform) {
      case PLATFORMS.ios:
        return 'wav';

      case PLATFORMS.android:
        return 'amr';

      default:
        throw new Error('Unexpected window.device.platform');
    }
  },

  getFileSavePrefix() {
    switch (window.device.platform) {
      case PLATFORMS.ios:
        return 'documents://';

      case PLATFORMS.android:
        return '';

      default:
        throw new Error('Unexpected window.device.platform');
    }
  }
};
