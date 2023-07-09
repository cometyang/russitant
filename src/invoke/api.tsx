import { OpenAISettings } from '@/interfaces/types'
import * as api from '@tauri-apps/api'
import {Store} from "tauri-plugin-store-api"

const store = new Store('config.json')

export const writeStore = async (key: string, value: any) => {
    await store.set(key, value)
    if (key === 'settings') {
        await store.save()
    }
}

export const readStore = async (key: string): Promise<any| undefined> => {
    const value = await store.get(key)
    return value || undefined
}

