import * as React from "react";
import { useEffect, useState } from "react";
import { BluetoothService } from "../services/BluetoothService";
import { Dialogs } from "@nativescript/core";

interface DeviceStatusProps {
  bluetoothService: BluetoothService;
}

export function DeviceStatus({ bluetoothService }: DeviceStatusProps) {
  const [esp32Status, setEsp32Status] = useState(false);
  const [smartwatchStatus, setSmartWatchStatus] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const esp32Sub = bluetoothService.getESP32Status().subscribe(setEsp32Status);
    const smartwatchSub = bluetoothService.getSmartwatchStatus().subscribe(setSmartWatchStatus);

    return () => {
      esp32Sub.unsubscribe();
      smartwatchSub.unsubscribe();
    };
  }, []);

  const handleBluetoothConnect = async () => {
    try {
      setIsScanning(true);
      const isEnabled = await bluetoothService.isBluetoothEnabled();
      
      if (!isEnabled) {
        await bluetoothService.enableBluetooth();
      }

      await Promise.all([
        bluetoothService.connectToESP32(),
        bluetoothService.connectToSmartwatch()
      ]);

      Dialogs.alert({
        title: "Success",
        message: "Devices connected successfully!",
        okButtonText: "OK"
      });
    } catch (error) {
      Dialogs.alert({
        title: "Connection Error",
        message: "Failed to connect to devices. Please ensure they are nearby and try again.",
        okButtonText: "OK"
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <stackLayout className="p-4">
      <button 
        className="bg-blue-600 text-white p-4 rounded-lg mb-4"
        isEnabled={!isScanning}
        onTap={handleBluetoothConnect}
      >
        {isScanning ? "Scanning..." : "Connect Bluetooth Devices"}
      </button>
      
      <stackLayout className="bg-white p-4 rounded-lg">
        <label className={`text-lg mb-2 ${esp32Status ? 'text-green-600' : 'text-red-600'}`}>
          ESP32: {esp32Status ? 'Connected' : 'Disconnected'}
        </label>
        <label className={`text-lg ${smartwatchStatus ? 'text-green-600' : 'text-red-600'}`}>
          Smartwatch: {smartwatchStatus ? 'Connected' : 'Disconnected'}
        </label>
      </stackLayout>
    </stackLayout>
  );
}