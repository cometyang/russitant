import { cn } from "@/theme/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/component/Select"
import Balancer from "react-wrap-balancer"
import { useMemo, useState } from "react"
import { Model, downloadedModels } from "@/data/models"
import { SpinnerButton } from "./Button"
import { DownloadIcon } from "@radix-ui/react-icons"
import { useGlobal } from "@/providers/global"
import { invoke } from "@tauri-apps/api/tauri"
import { Command } from "@/invoke/command"
import { appWindow } from '@tauri-apps/api/window';
export const ModelSelector = ({ className = "" }) => {
    const {
       // modelsDirectoryState: { updateModelsDirectory, modelsMap },
       // knownModels: { models, modelMap }
      } = useGlobal()

    interface ModelByString {
        [key: string]: {
            name: string,
            url : string}
    }

    const modelMap : ModelByString = {
        "LLaMa-7B-GGML": {
            name: "LLama 7B",
            url: "https://huggingface.co/Cometyang/ggml-q4/resolve/main/ggml-model-q4_0.bin",
        },
        "Orca-mini-13B-GGML": {
            name: "Orca mini 13B",
            url: "https://huggingface.co/Cometyang/ggml-q4/resolve/main/ggml-model-q4_0.bin",
        }
    }
    const [selectedModelHash, setSelectedModelHash] = useState<string>("")
    const [isDownloading, setIsDownloading] = useState(false)

    const selectedModel = useMemo(
        () => modelMap[selectedModelHash],
        [modelMap, selectedModelHash]
      )

    // const selectedModel = () => {
       
    //    return modelMap[selectedModelHash];
    // }

    const models = downloadedModels
    return (
        <div className={cn("flex gap-2 w-full", className)}>
            <Select value={selectedModelHash} onValueChange={setSelectedModelHash}>
            <SelectTrigger
          className={cn(
            "w-full",
             "text-gray-12" 
          )}>
          <SelectValue aria-label={"Hello"}>
            {selectedModel ? (
              <div className="flex gap-2 items-center">
                <span>{selectedModel.name}</span>
                <code className="text-sm text-ellipsis text-gray-10">
                  (
                    {"hash code"}
                  )
                </code>
              </div>
            ) : (
              <span>Select a Model to download</span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="flex h-96 w-full">
          {models
            .filter((model) => true)
            .map((model) => (
              <SelectItem key={model.url} value={model.name}>
                <div
                  className={cn("flex flex-col gap-2 text-md w-full text-xs  text-primary bg-foreground-mute hover:bg-foreground active:bg-foreground-accent border border-primary")}>
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={cn(
                        "w-full text-lg",
                           "text-gray-12"
                      )}>
                      {model.name}
                    </span>

                    <span className="flex flex-col items-end">
                      <code className="text-ellipsis text-gray-10">
                        {"hash code"}
                      </code>
                      <div className="italic">
                        {"Unknown"} GB
                      </div>
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <pre className="max-w-screen-sm whitespace-pre-wrap">
                      <Balancer>{model.description}</Balancer>
                    </pre>

                    <code className="text-gray-10 break-all max-w-screen-md">
                      <Balancer>{model.url}</Balancer>
                    </code>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {model.licenses.map((license) => (
                        <span
                          key={license}
                          className="px-2 py-1 rounded-lg bg-gray-6">
                          {license}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
        </SelectContent>
        </Select>
        <SpinnerButton
        Icon={DownloadIcon}
        disabled={false}
        isSpinning={isDownloading}
        onClick={async () => {
          setIsDownloading(true)
          try {
            const ret = await invoke(Command.DownloadFile, {
                url: selectedModel.url,
                name: selectedModel.name,
                window: appWindow
            })
            console.log(ret)

        //     await invoke(InvokeCommand.SetModelConfig, {
        //       path: outputPath,
        //       config: {
        //         modelType: selectedModel.modelType,
        //         tokenizer: selectedModel.tokenizers?.[0] || "",
        //         defaultPromptTemplate: selectedModel.promptTemplate || ""
        //       }
        //     })
          } catch (error) {
            alert(error)
          }
        setSelectedModelHash("")

          //await updateModelsDirectory()
          setIsDownloading(false)
        }}>
        Download
      </SpinnerButton>
        </div>
    )

}