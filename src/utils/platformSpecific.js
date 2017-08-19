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
        return '';
    }
  },

  getRecordExtension() {
    switch (window.device.platform) {
      case PLATFORMS.ios:
        return 'wav';

      case PLATFORMS.android:
        return 'amr';

      default:
        return 'wav';
    }
  },

  getFileSavePrefix() {
    switch (window.device.platform) {
      case PLATFORMS.ios:
        return 'documents://';

      case PLATFORMS.android:
        return '';

      default:
        return '';
    }
  }
};
