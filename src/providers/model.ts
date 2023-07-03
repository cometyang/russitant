"use client"

import { Model } from "@/data/models"
import { createProvider } from "puro"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"


const useModelProvider = ({model}:{model: Model}) => {


    return {
        model
    }
    
}

const { BaseContext, Provider } = createProvider(useModelProvider)

export const useModel = () => useContext(BaseContext)
export const ModelProvider = Provider

