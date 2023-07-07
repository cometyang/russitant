

export enum DownloadState {
    None = "none",
    Idle = "idle",
    Downloading = "downloading",
    Validating = "validating",
    Completed = "completed",
    Errored = "errored"
}

export type ProgressData = {
    eventId: string
    progress: number
    size: number
    downloadState: DownloadState
    error?: string
}
