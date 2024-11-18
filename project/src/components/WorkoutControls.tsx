import * as React from "react";
import { useEffect, useState } from "react";
import { BluetoothService } from "../services/BluetoothService";
import { Observable } from "rxjs";

interface WorkoutControlsProps {
  bluetoothService: BluetoothService;
}

export function WorkoutControls({ bluetoothService }: WorkoutControlsProps) {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLevelChange = async (level: number) => {
    try {
      setIsUpdating(true);
      await bluetoothService.sendCommandToESP32(level);
      setSelectedLevel(level); // Move this after successful ESP32 command
    } catch (error) {
      console.error('Error updating workout level:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <stackLayout className="p-4 bg-white rounded-lg shadow-md">
      <label className="text-xl mb-4 font-bold text-center">
        Workout Level: {selectedLevel}
      </label>
      <flexboxLayout className="justify-around">
        {[1, 2, 3, 4].map((level) => (
          <button
            key={level}
            className={`p-4 rounded-lg ${
              isUpdating ? 'opacity-50' : ''
            } ${
              selectedLevel === level 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
            isEnabled={!isUpdating}
            onTap={() => handleLevelChange(level)}
          >
            {level}
          </button>
        ))}
      </flexboxLayout>
      {isUpdating && (
        <label className="text-sm text-gray-600 text-center mt-2">
          Updating workout level...
        </label>
      )}
    </stackLayout>
  );
}