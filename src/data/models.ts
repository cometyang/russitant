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
]