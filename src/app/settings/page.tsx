'use client'

import { Button } from '../components/Button'
import { invoke } from '@tauri-apps/api/tauri'
import React, { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { listen } from '@tauri-apps/api/event';
import { appWindow } from '@tauri-apps/api/window';
const modelList = [
    {
      name: "WizardLM-7B-GGML",

    },
    {
      name: "WizardLM-13B-GGML",

    },
    {
      name: "LLaMa-7B-GGML",

     
    },
    {
      name: "LLaMa-30B-GGML",

 
    },
    {
      name: "LLaMa-13B-GGML",


    },
    {
      name: "LLaMa-65-GGML",

    },
  ];



export default function Page(){
    const [completed, setCompleted] = useState<number>(0);

    useEffect(() => {
        const unlistenProgress = listen<string>('DOWNLOAD_PROGRESS', (event) => {
            console.log(`Got error in window ${event.windowLabel}, payload: ${event.payload["percentage"]}`);
            setCompleted(event.payload["percentage"])
        });

      //setInterval(() => setCompleted(Math.floor(Math.random() * 100) + 1), 2000);

      return () => {
        // Anything in here is fired on component unmount.
        unlistenProgress;
        }
    }, []);
    
   


    const handleDownload = async () => {
        const ret = await invoke("download_file", {
            url: `https://huggingface.co/gpt2/resolve/main/64-8bits.tflite`,
            path: `./download/64-8bits.tflite`,
            window: appWindow
          });
        console.log(ret)
      }

    return (

    <div className="space-y-4 text-vercel-pink">
         <ul className="sidebar__list">
          {modelList.map((item) => {
            return (
              <li className="sidebar__item" key={item.name}>
                  <span className="sidebar__name"> {item.name} </span>
              </li>
            );
          })}
        </ul>
        <div>
        <ProgressBar completed={completed} />
        </div>
        <div>
        <label>
            <Button type="button" onClick={handleDownload}>
              Download Model
            </Button>
        </label>

        </div>

        </div>
);
}


