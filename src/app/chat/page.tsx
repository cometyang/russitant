'use client'

import ChatBox from "@/component/ChatBox";
//import Switch from "@/component/Switch";
import { ViewContainer, ViewHeader } from "@/layout/view";
import useStore from "@/providers/store";
import { useGlobal } from "@/providers/global";
import {FormControlLabel, Switch, TextField} from "@mui/material";
import React, { useState } from "react";
import { OpenAISettings } from "@/interfaces/types";
import { getDefaultSettings } from "http2";

export default function Chat() {

    const {store} = useGlobal();
    //const [settingsEdit, setSettingsEdit] = useState<OpenAISettings>(getDefaultSettings())
    const switchHandler = (event) => {
      store.setUsingOpenAI(event.target.checked);
    };
    return (
  <div className="flex flex-col w-full h-full p-4">
    <ViewContainer className="relative z-50">
      <ViewHeader>
      <FormControlLabel control={<Switch 
        checked={store.usingOpenAI}
        onChange={switchHandler}
      />} label={store.usingOpenAI? "OpenAI": "Local Model"} />

      <TextField
                    autoFocus
                    margin="dense"
                    label={'openai api key'}
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={store.settings.openaiKey}
                    onChange={(e) => 
                      store._setSettings({ ...store.settings, openaiKey: e.target.value.trim() })
                    }
      />
      

      <div className="font-bold leading-none text-lg text-primary">AI Chat Bot</div>
      </ViewHeader>
    <ChatBox className="w-full h-full" />
    </ViewContainer>
  </div>
  );

}
//export default function Chat() {


//);

//export default Chat;