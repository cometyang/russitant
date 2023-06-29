export interface Model {
    name: string
    url:  string
}

export const downloadedModels: Model [] = [
    {
        name: "LLaMa-7B-GGML",
        url: "https://huggingface.co/Cometyang/ggml-q4/resolve/main/ggml-model-q4_0.bin"
      },
      {
        name: "Orca-mini-13B-GGML",
        url: "https://huggingface.co/Cometyang/ggml-q4/resolve/main/orca-mini-13b.ggmlv3.q4_0.bin"
      },
]