'use client'

import Canvas from "@/component/Canvas";
import PromptForm from "@/component/PromptForm";


import { useState } from "react";




export default function Dream() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [canShowImage, setCanShowImage] = useState(false);
  
  return (
    <div className="flex flex-col w-full h-full p-4">
     
    <div className="font-bold leading-none text-lg text-primary">AI Drawing Bot</div>
      <Canvas/>
      <PromptForm />
    </div>
  );
}

// function readAsDataURL(file) {
//   return new Promise((resolve, reject) => {
//     const fr = new FileReader();
//     fr.onerror = reject;
//     fr.onload = () => {
//       resolve(fr.result);
//     };
//     fr.readAsDataURL(file);
//   });
// }

