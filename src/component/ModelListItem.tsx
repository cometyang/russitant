import { ModelMetadata } from "@/data/ModelMetadata";
import { Model } from "@/data/models";
import { ModelProvider, useModel } from "@/providers/model";
import { cn } from "@/theme/utils";
import { useState } from "react";
import { ModelConfig } from "./ModelConfig";

const ModelLabel = () => {
    const { model } = useModel()

    return (
        <div className="flex flex-col w-full justify-start">
            <div className="flex text-md gap-2">
                <span>{model.name}</span>
            
            </div>
            <div className="flex text-xs items-center text-gray-10 gap-1">

            </div>
        </div>
    )
}

export const ModelListItem = ({ model }: { model: ModelMetadata }) => {
    return (
    <ModelProvider model={model}>
    <div
    className={cn(
        "flex flex-col gap-4 rounded-md p-2 pl-3",
        "text-gray-11 hover:text-gray-12",
        "transition-colors group",
        "border border-green-7 hover:border-green-8"
        )}>

            <div className="flex justify-between w-full">
                <ModelLabel />
            </div>
            <ModelConfig/>
        </div>
    </ModelProvider>
    )
}