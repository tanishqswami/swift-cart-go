import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";

const WebcamCapture: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // Get available video devices
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDevice(videoDevices[0].deviceId);
        }
      })
      .catch(err => console.error('Error getting devices:', err));

    return () => {
      // Cleanup stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          deviceId: selectedDevice ? { exact: selectedDevice } : undefined
        }
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-lg mb-4">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg shadow-lg"
        />
      </div>

      <div className="w-full max-w-lg mb-4">
        <select
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
            </option>
          ))}
        </select>

        <div className="flex justify-center gap-4">
          {!stream ? (
            <Button
              onClick={startCamera}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Start Camera
            </Button>
          ) : (
            <Button
              onClick={stopCamera}
              variant="destructive"
            >
              Stop Camera
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebcamCapture; 