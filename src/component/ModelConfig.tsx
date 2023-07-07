import { useState } from "react";
import { SpinnerButton } from "./Button";
import { cn } from "@/theme/utils";
import { TrashIcon } from "@radix-ui/react-icons";
import { useModel } from "@/providers/model";
import { DownloadState } from "@/invoke/model";
import { DownloadProgress } from "./DownloadProgress";

export const ModelConfig = () => {
    const [activateModel, setActiveModel] = useState<boolean>(false);

    const {
        model,
        downloadState
    } = useModel()
    return (
        <div className="flex items-center justify-between w-full gap-2 group">
           <div className="flex gap-3">
            <SpinnerButton
          className={cn(
            "w-10 p-1 justify-center",
            "group-hover:opacity-100 opacity-0 transition-opacity",
            downloadState === DownloadState.Downloading ? "hidden" : "flex"
          )}
          Icon={TrashIcon}
        //   onClick={async () => {
        //     if (!(await confirm(`Deleting ${model.name}?`))) {
        //       return
        //     }

        //     await invoke(InvokeCommand.DeleteModelFile, {
        //       path: model.path
        //     })

        //     await updateModelsDirectory()
        //   }}
        //   disabled={modelLoadState === ModelLoadState.Loaded}
        />
                 <DownloadProgress />
            </div>
            <div className="flex items-center justify-end gap-2">
            <SpinnerButton
            Icon={({ className }) => (
                <code
                className={cn(
                    "flex items-center justify-center",
                    "text-xs rounded-lg bg-gray-6 py-2 px-3",
                    className
                )}>
                {/* {modelStats.launchCount} */}
                </code>
            )}
            // isSpinning={modelLoadState === ModelLoadState.Loading}
            disabled={
                false
                // modelLoadState === ModelLoadState.Loaded ||
                // (downloadState !== DownloadState.None &&
                // downloadState !== DownloadState.Completed)
            }
            onClick={() => {
                // modelStats.incrementLaunchCount()
                // loadModel()
            }}>
                {"Loaded"}
            {/* {modelLoadState === ModelLoadState.Loaded ? "Loaded" : "Load Model"} */}
            </SpinnerButton>
            </div>
        </div>
        
    )
}