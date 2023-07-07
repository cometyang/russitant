import React from "react";
import Image from "next/image";
import { ReactSketchCanvas } from "react-sketch-canvas";
import JSpinner from "./JSpinner"

interface CanvasProps {
  width: number;
  height: number;
}

export default function Canvas() {


  return(


    
      <div className="relative w-full aspect-square">
        <Image
        alt=""
        layout="fill"
        className="absolute animate-in fade-in"
        src=""
        />
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