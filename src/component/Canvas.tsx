import React, { useState } from "react";
import Image from "next/image";
import { ReactSketchCanvas } from "react-sketch-canvas";
import JSpinner from "./JSpinner"
import { useGlobal } from "@/providers/global";

interface CanvasProps {
  width: number;
  height: number;
}

export default function Canvas() {

  const {imageData, setImageData} = useGlobal();

  return(



      <div className="relative w-full aspect-square">
          {imageData && 
            <Image
            alt="Image"
            className="absolute animate-in fade-in"
            width={500}
            height={500}
            src={imageData}
          />
        }
        <div className="absolute top-0 left-0 w-full h-full">
          <ReactSketchCanvas 
          strokeWidth={80}
          strokeColor="black"
          canvasColor="transparent"
          />
          </div>
      </div>
    
  )
}