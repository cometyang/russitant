export type FileInfo = {
    name: string
    path: string
}

export type ModelMetadata = FileInfo & {
    modeltype: string
}

export type DirectoryState = {
    path: string
    files: FileInfo[]
}