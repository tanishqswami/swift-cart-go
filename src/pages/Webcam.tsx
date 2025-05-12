import React from "react";
import WebcamCapture from "@/components/WebcamCapture";

const Webcam: React.FC = () => {
  return (
    <div className="container mx-auto pb-20">
      <h1 className="text-2xl font-bold p-4">Webcam Capture</h1>
      <WebcamCapture />
    </div>
  );
};

export default Webcam; 