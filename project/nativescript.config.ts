import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.nativescript.fitnessapp',
  appPath: 'src',
  appResourcesPath: '../../tools/assets/App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
    permissions: [
      'android.permission.BLUETOOTH',
      'android.permission.BLUETOOTH_ADMIN',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.BLUETOOTH_SCAN',
      'android.permission.BLUETOOTH_CONNECT'
    ]
  },
  ios: {
    NSBluetoothAlwaysUsageDescription: 'The app needs Bluetooth access to connect to fitness devices'
  }
} as NativeScriptConfig;