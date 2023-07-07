import { ModelMetadata } from "@/data/ModelMetadata"
import { useEffect, useRef } from "react"
import { useContext, useState } from "react"
import { createProvider } from "puro"


const useGlobalProvider = () => {

    //const activeModelState = useState<ModelMetadata>(null)
    const [imageData, setImageData] = useState(null);
    return {
        //knownModels
        imageData,
        setImageData
    }
}


const {BaseContext, Provider} = createProvider(useGlobalProvider)

export const GlobalProvider = Provider

export const useGlobal = () => useContext(BaseContext)