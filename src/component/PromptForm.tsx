import { useEffect, useState } from "react";
import { SpinnerButton } from "./Button";
import { Input } from "./Input";
import { invoke } from "@tauri-apps/api/tauri";
import { DownloadIcon } from "@radix-ui/react-icons";
import { useGlobal } from "@/providers/global";

const samplePrompts = [
  "a gentleman otter in a 19th century portrait",
  "bowl of ramen in the style of a comic book",
  "flower field drawn by Jean-Jacques Sempé",
  "illustration of a taxi cab in the style of r crumb",
  "multicolor hyperspace",
  "painting of fruit on a table in the style of Raimonds Staprans",
  "pencil sketch of robots playing poker",
  "photo of an astronaut riding a horse",
];
	
// import * as _ from "lodash";

export default function PromptForm() {
  const [prompt, setPrompt] = useState(samplePrompts[0]);
  const [isProcessing, setProcessing] = useState(false);

  const {imageData, setImageData} = useGlobal();

  
  const submit = () => {
    setPrompt(prompt);
    console.log(prompt)
  };

  return (
    // <form
    //   onSubmit={props.onSubmit}
    //   className="py-5 animate-in fade-in duration-700"
    // >
      <div className="flex max-w-[512px]">
        <Input
          type="text"
          defaultValue={prompt}
          name="prompt"
          placeholder="Enter a prompt..."
          className="block fill-primary w-full flex-grow rounded-l-md"
          onInput={ (e) => setPrompt((e.target as HTMLInputElement).value) }
          onKeyDown={ (e) => { if (e.key === 'Enter') { submit() } } }
        />

        <SpinnerButton
        Icon={DownloadIcon}
        disabled={false}
        isSpinning={isProcessing}
        onClick={
          async () => {
            setProcessing(true);
            
            console.log(prompt);
            const response=await invoke("generate_image", {prompt: prompt})
    
              //return setImageData(JSON::stringify(res))
            setImageData(response);
            
            setProcessing(false);
          }
        }
        >
          Generate
        </SpinnerButton>
      </div>
    // </form>
  );
}