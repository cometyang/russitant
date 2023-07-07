export type FileInfo = {
    name: string
    path: string
    size?: number
}

export type ModelMetadata = FileInfo & {
    modeltype: string
}

export type DirectoryState = {
    path: string
    files: FileInfo[]
}