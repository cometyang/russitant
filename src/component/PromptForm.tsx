import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";

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
  const [prompt] = useState(samplePrompts[0]);
  // const [image, setImage] = useState(null);

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
        />

        <Button
          className="bg-black text-primary rounded-r-md text-small inline-block px-3 flex-none"
          type="submit"
        >
          Generate
        </Button>
      </div>
    // </form>
  );
}