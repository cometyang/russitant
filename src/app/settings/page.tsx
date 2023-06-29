'use client'

import React, { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { Button } from "@/component/Button"
import { appWindow } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api/tauri'
import { listen } from '@tauri-apps/api/event';
import { downloadedModels } from "@/data/models";
import { open } from '@tauri-apps/api/dialog';
import { appDir } from '@tauri-apps/api/path';
import { Command } from "@/invoke/command"

let modelsFolder: string = '';

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
    
    function getLanguageModels() {
      // tauri
      //   .invoke<CommandResponseLanguagesModels>('get_language_models')
      //   .then((result) => {
      //     console.log('Language models:' + JSON.stringify(result));
      //     languageModels = result.models;
      //     current_model = languageModels.filter((model) => model.current == true)[0];
      //     console.log('Language models javascript:' + JSON.stringify(languageModels));
      //     console.log('Current model:' + JSON.stringify(current_model));
      //   })
      //   .catch((error) => {
      //     console.log('Error:' + error);
      //     toasts.error('Error getting language models: ' + error);
      //   });
    }


    const activeModel = async () => {
        const ret = await invoke(Command.SetActiveModel, {
          });
        console.log(ret)
      }

    const handleDownload = async () => {
        const ret = await invoke(Command.DownloadFile, {
            url: `https://huggingface.co/gpt2/resolve/main/64-8bits.tflite`,
            path: `./download/64-8bits.tflite`,
            window: appWindow
          });
        console.log(ret)
      }

    const selectFolder = async () => {
   
      const selected = await open({
        directory: true,
        multiple: true,
        defaultPath: await appDir(),
      });
      if (Array.isArray(selected)) {
        // user selected multiple directories
      } else if (selected === null) {
        // user cancelled the selection
      } else {
        // user selected a single directory
        
      }
    }

    return (

    <div className="space-y-4 text-vercel-pink">
         <ul className="sidebar__list">
          {downloadedModels.map((item) => {
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
            <Button type="button" onClick={selectFolder}>
              Select Folder
            </Button>
        </label>
        <label>
            <Button type="button" onClick={handleDownload}>
              Download Model
            </Button>
        </label>
        <label>
            <Button type="button" onClick={activeModel}>
              Active Model
            </Button>
        </label>
        </div>

        </div>
);
}


