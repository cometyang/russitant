"use client"

import { ModelMetadata } from "@/data/ModelMetadata"
import { Model } from "@/data/models"
import { useModelDownload } from "@/hook/useModelDownload"
import { createProvider } from "puro"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"


const useModelProvider = ({model}:{model: ModelMetadata}) => {

    const { downloadState, pauseDownload, progress, resumeDownload, modelSize} = useModelDownload(model)
    return {
        model,
        modelSize,
        downloadState,
        progress,
        pauseDownload,
        resumeDownload,
    }
    
}

const { BaseContext, Provider } = createProvider(useModelProvider)

export const useModel = () => useContext(BaseContext)
export const ModelProvider = Provider

