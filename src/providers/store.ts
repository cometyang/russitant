import { Config, OpenAISettings } from "@/interfaces/types";
import { useEffect, useState } from "react";
import * as api from "../invoke/api";
import { v4 as uuidv4 } from "uuid"
export function getDefaultSettings(): OpenAISettings {
    return {
        openaiKey: '',
        apiHost: 'https://api.openai.com',
        model: "gpt-3.5-turbo",
    }
}

export async function readSettings(): Promise<OpenAISettings> {
    const setting: OpenAISettings | undefined = await api.readStore('settings')
    if (!setting) {
        return getDefaultSettings()
    }
    return setting
}

export async function writeSettings(settings: OpenAISettings) {
    if (!settings.apiHost) {
        settings.apiHost = getDefaultSettings().apiHost
    }
    console.log('writeSettings.apiHost', settings.apiHost)
    return api.writeStore('settings', settings)
}

export async function readConfig(): Promise<Config> {
    let config: Config | undefined = await api.readStore('configs')
    if (!config) {
        config = { uuid: uuidv4() }
        await api.writeStore('configs', config)
    }
    return config;
}

export async function writeConfig(config: Config) {
    return api.writeStore('configs', config)
}

export default function useStore() {
    const [settings, _setSettings]=useState<OpenAISettings>(getDefaultSettings())
    const [usingOpenAI, setUsingOpenAI] = useState(false);
    useEffect(() => {
        readSettings().then((settings) => {
            _setSettings(settings)
        })
    },[])

    return {
        settings,
        _setSettings,
        usingOpenAI,
        setUsingOpenAI
    }
}