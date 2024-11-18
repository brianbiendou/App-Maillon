import * as React from "react";
import { useState } from "react";
import { BluetoothService } from "../services/BluetoothService";
import { DeviceStatus } from "./DeviceStatus";
import { WorkoutControls } from "./WorkoutControls";
import { DataDisplay } from "./DataDisplay";

export function MainScreen() {
  const [bluetoothService] = useState(() => new BluetoothService());

  return (
    <scrollView>
      <stackLayout className="p-4">
        <label className="text-2xl font-bold text-center mb-4">
          Fitness Monitor
        </label>
        <DeviceStatus bluetoothService={bluetoothService} />
        <DataDisplay bluetoothService={bluetoothService} />
        <WorkoutControls bluetoothService={bluetoothService} />
      </stackLayout>
    </scrollView>
  );
}