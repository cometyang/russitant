'use client'

import React, { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { Button } from "@/component/Button"
import { appWindow } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api/tauri'
import { listen } from '@tauri-apps/api/event';
import { downloadedModels, downloadedModelMetadatas } from "@/data/models";
import { open } from '@tauri-apps/api/dialog';
import { appDir } from '@tauri-apps/api/path';
import { Command } from "@/invoke/command"
import { Input } from "@/component/Input";
import { ViewContainer, ViewHeader, ViewBody } from "@/layout/view";
import { DotsHorizontalIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { ModelSelector } from "@/component/ModelSelector";
import { useGlobal } from "@/providers/global";
import { ModelListItem } from "@/component/ModelListItem";

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



    // const {

    // } = useGlobal()
    
    return (

      <ViewContainer className="relative z-50">
      <ViewHeader>
         <Input
            className ="w-full lg:w-144 leading-none text-lg text-primary"
            value="Models"
            readOnly
            placeholder="Models directory"
         />
         <Button
            title="Change models directory"
            className="w-10 p-3 rounded-none"
            onClick={async () => {
              const selected = await open({
                directory: true,
                multiple: true,
                defaultPath: await appDir(),
              }) as string

              if (!selected) {
                return
              }
              //await updateModelsDirectory(selected)
            }}>
            <DotsHorizontalIcon />
          </Button>

          <Button
            title="Open models directory"
            className="w-10 p-3 rounded-l-none"
            onClick={() => {
              // invoke(InvokeCommand.OpenDirectory, {
              //   path: modelsDirectory
              // })
            }}>
            <OpenInNewWindowIcon />
          </Button>
      </ViewHeader>
      <ViewBody className="flex flex-col p-4 gap-2">
        <ModelSelector className="sticky top-0 z-50  text-primary shadow-sm p-1 bg-gray-1 rounded-lg shadow-gray-6" />
        {downloadedModels.length === 0 && (
          <p className="text-gray-9 italic pointer-events-none text-center">
            {`To start, download a model or change the models directory by
            clicking the "..." button.`}
          </p>
        )}
        {/* <div>
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
        </div> */}
        <div className="flex flex-col p-2 gap-6  text-primary">
          {downloadedModelMetadatas
            .sort((a, b) => -1
              // activeModel?.path === a.path
              //   ? -1
              //   : activeModel?.path === b.path
              //   ? 1
              //   : 0
            )
            .map((model) => (
              <ModelListItem key={model.name} model={model} />
            ))}
        </div>
        
        </ViewBody>
    </ViewContainer>
);
}


