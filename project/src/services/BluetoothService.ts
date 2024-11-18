import { BleClient, BleDevice, numberToUUID } from '@capacitor-community/bluetooth-le';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DeviceData {
  heartRate: number;
  vo2: number;
}

export class BluetoothService {
  private esp32Connected = new BehaviorSubject<boolean>(false);
  private smartwatchConnected = new BehaviorSubject<boolean>(false);
  private deviceData = new BehaviorSubject<DeviceData>({ heartRate: 0, vo2: 0 });

  private ESP32_UUID = '4FAFC201-1FB5-459E-8FCC-C5C9C331914B';
  private SMARTWATCH_UUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
  private HEART_RATE_SERVICE = '180D';
  private HEART_RATE_CHARACTERISTIC = '2A37';
  private VO2_SERVICE = '181E';
  private VO2_CHARACTERISTIC = '2A3B';

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      await BleClient.initialize();
    } catch (error) {
      console.error('Error initializing Bluetooth:', error);
    }
  }

  public async isBluetoothEnabled(): Promise<boolean> {
    try {
      return await BleClient.isEnabled();
    } catch (error) {
      console.error('Error checking Bluetooth status:', error);
      return false;
    }
  }

  public async enableBluetooth(): Promise<void> {
    try {
      await BleClient.enable();
    } catch (error) {
      console.error('Error enabling Bluetooth:', error);
      throw error;
    }
  }

  public async connectToESP32(): Promise<void> {
    try {
      const device = await BleClient.requestDevice({
        services: [this.ESP32_UUID],
        name: 'ESP32'
      });
      
      await BleClient.connect(device.deviceId);
      this.esp32Connected.next(true);
      
      device.addEventListener('gattserverdisconnected', () => {
        this.esp32Connected.next(false);
      });
    } catch (error) {
      console.error('Error connecting to ESP32:', error);
      throw error;
    }
  }

  public async connectToSmartwatch(): Promise<void> {
    try {
      const device = await BleClient.requestDevice({
        services: [this.HEART_RATE_SERVICE],
        name: 'Smartwatch'
      });
      
      await BleClient.connect(device.deviceId);
      this.smartwatchConnected.next(true);
      this.startDataCollection(device.deviceId);
      
      device.addEventListener('gattserverdisconnected', () => {
        this.smartwatchConnected.next(false);
      });
    } catch (error) {
      console.error('Error connecting to Smartwatch:', error);
      throw error;
    }
  }

  public async sendCommandToESP32(level: number): Promise<void> {
    if (this.esp32Connected.value) {
      try {
        const device = await BleClient.requestDevice({
          services: [this.ESP32_UUID]
        });
        
        await BleClient.write(
          device.deviceId,
          this.ESP32_UUID,
          '2A3C',
          new Uint8Array([level])
        );
      } catch (error) {
        console.error('Error sending command to ESP32:', error);
        throw error;
      }
    }
  }

  private async startDataCollection(deviceId: string): Promise<void> {
    if (this.smartwatchConnected.value) {
      try {
        // Start heart rate notifications
        await BleClient.startNotifications(
          deviceId,
          this.HEART_RATE_SERVICE,
          this.HEART_RATE_CHARACTERISTIC,
          (value) => {
            const heartRate = this.parseHeartRate(value);
            this.updateDeviceData({ heartRate });
          }
        );

        // Start VO2 notifications
        await BleClient.startNotifications(
          deviceId,
          this.VO2_SERVICE,
          this.VO2_CHARACTERISTIC,
          (value) => {
            const vo2 = this.parseVO2(value);
            this.updateDeviceData({ vo2 });
          }
        );
      } catch (error) {
        console.error('Error starting notifications:', error);
      }
    }
  }

  private parseHeartRate(value: DataView): number {
    // Heart Rate Measurement characteristic format
    const flags = value.getUint8(0);
    const rate16Bits = flags & 0x1;
    let heartRate: number;
    if (rate16Bits) {
      heartRate = value.getUint16(1, true);
    } else {
      heartRate = value.getUint8(1);
    }
    return heartRate;
  }

  private parseVO2(value: DataView): number {
    // Simple VO2 parsing (implementation depends on device format)
    return value.getFloat32(0, true);
  }

  private updateDeviceData(newData: Partial<DeviceData>): void {
    this.deviceData.next({
      ...this.deviceData.value,
      ...newData
    });
  }

  public getESP32Status(): Observable<boolean> {
    return this.esp32Connected.asObservable();
  }

  public getSmartwatchStatus(): Observable<boolean> {
    return this.smartwatchConnected.asObservable();
  }

  public getDeviceData(): Observable<DeviceData> {
    return this.deviceData.asObservable();
  }
}