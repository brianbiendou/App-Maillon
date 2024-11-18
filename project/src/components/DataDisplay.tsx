import * as React from "react";
import { useEffect, useState } from "react";
import { BluetoothService, DeviceData } from "../services/BluetoothService";

interface DataDisplayProps {
  bluetoothService: BluetoothService;
}

export function DataDisplay({ bluetoothService }: DataDisplayProps) {
  const [data, setData] = useState<DeviceData>({ heartRate: 0, vo2: 0 });

  useEffect(() => {
    const subscription = bluetoothService.getDeviceData().subscribe(setData);
    return () => subscription.unsubscribe();
  }, []);

  return (
    <stackLayout className="p-4 bg-white rounded-lg shadow-md">
      <label className="text-xl font-bold mb-2">Fitness Metrics</label>
      <gridLayout rows="auto, auto" columns="*, *" className="text-center">
        <stackLayout row="0" col="0" className="p-2">
          <label className="text-gray-600">Heart Rate</label>
          <label className="text-2xl text-blue-600">{data.heartRate}</label>
          <label className="text-sm text-gray-500">BPM</label>
        </stackLayout>
        <stackLayout row="0" col="1" className="p-2">
          <label className="text-gray-600">VO2</label>
          <label className="text-2xl text-blue-600">{data.vo2}</label>
          <label className="text-sm text-gray-500">mL/kg/min</label>
        </stackLayout>
      </gridLayout>
    </stackLayout>
  );
}