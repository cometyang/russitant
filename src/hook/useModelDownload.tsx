import { ModelMetadata } from "@/data/ModelMetadata"
import { DownloadState, type ProgressData } from "@/invoke/model"
import { useState } from "react"

export { DownloadState, type ProgressData }

export const useModelDownload = (model: ModelMetadata) => {
    const [progress, setProgress] = useState(0)
    const [downloadState, setDownloadState]= useState<DownloadState>(
        DownloadState.None
    )

    const [eventId, setEventId] = useState<string| null>(null)
    const [modelSize, setModelSize] = useState(model.size)


    
    const resumeDownload = async () => {

    }

    const pauseDownload = async () => {

    }

    return {
        progress,
        downloadState,
        modelSize,
        resumeDownload,
        pauseDownload
    }
}

