import { ModelMetadata } from "@/data/ModelMetadata"
import { useEffect, useRef } from "react"
import { useContext, useState } from "react"
import { createProvider } from "puro"
import useStore from "./store"


const useGlobalProvider = () => {

    //const activeModelState = useState<ModelMetadata>(null)
    const [imageData, setImageData] = useState(null);
    const store = useStore();
    return {
        //knownModels
        imageData,
        setImageData,
        store
    }
}


const {BaseContext, Provider} = createProvider(useGlobalProvider)

export const GlobalProvider = Provider

export const useGlobal = () => useContext(BaseContext)