import { ModelMetadata } from "./ModelMetadata"

export interface Model {
    name: string
    url:  string
    description: string
    licenses: string[]
}

export const downloadedModels: Model [] = [
    {
        name: "LLaMa-7B-GGML",
        url: "https://huggingface.co/Cometyang/ggml-q4/resolve/main/ggml-model-q4_0.bin",
        description: "LLaMa 7B model",
        licenses:["LLaMa"]
      },
      {
        name: "Orca-mini-13B-GGML",
        url: "https://huggingface.co/Cometyang/ggml-q4/resolve/main/orca-mini-13b.ggmlv3.q4_0.bin",
        description: "Orca 13B model",
        licenses:["LLaMa","Orca"]

      },
      {
        name: "Orca-mini-3B-GGML",
        url: "https://huggingface.co/Cometyang/ggml-q4/resolve/main/orca-mini-13b.ggmlv3.q4_0.bin",
        description: "Orca 3B model",
        licenses:["LLaMa","Orca"]

      },
      {
        name: "Orca-mini-7B-GGML",
        url: "https://huggingface.co/Cometyang/ggml-q4/resolve/main/orca-mini-13b.ggmlv3.q4_0.bin",
        description: "Orca 7B model",
        licenses:["LLaMa","Orca"]

      },
]

export const downloadedModelMetadatas : ModelMetadata []= [
  {
    name: "LLaMa-7B-GGML",
    path: "https://huggingface.co/Cometyang/ggml-q4/resolve/main/ggml-model-q4_0.bin",
    size: -1,
    modeltype: "LLama"
    // description: "LLaMa 7B model",
    // licenses:["LLaMa"]
  },
  {
    name: "Orca-mini-13B-GGML",
    path: "https://huggingface.co/Cometyang/ggml-q4/resolve/main/orca-mini-13b.ggmlv3.q4_0.bin",
    size: -1,
    modeltype: "LLama"
    // description: "Orca 13B model",
    // licenses:["LLaMa","Orca"]

  },
  {
    name: "Orca-mini-3B-GGML",
    path: "https://huggingface.co/Cometyang/ggml-q4/resolve/main/orca-mini-13b.ggmlv3.q4_0.bin",
    size: -1,
    modeltype: "LLama"
    // description: "Orca 3B model",
    // licenses:["LLaMa","Orca"]

  },
  {
    name: "Orca-mini-7B-GGML",
    path: "https://huggingface.co/Cometyang/ggml-q4/resolve/main/orca-mini-13b.ggmlv3.q4_0.bin",
    size: -1,
    modeltype: "LLama"
    // description: "Orca 7B model",
    // licenses:["LLaMa","Orca"]

  },
]