'use client'

import { Button } from '../components/Button'

import React, { useState } from "react";

const modelList = [
    {
      name: "WizardLM-7B-GGML",

    },
    {
      name: "WizardLM-13B-GGML",

    },
    {
      name: "LLaMa-7B-GGML",

     
    },
    {
      name: "LLaMa-30B-GGML",

 
    },
    {
      name: "LLaMa-13B-GGML",


    },
    {
      name: "LLaMa-65-GGML",

    },
  ];


export default function Page(){
    return (
   
    <div className="space-y-4 text-vercel-pink">
         <ul className="sidebar__list">
          {modelList.map((item) => {
            return (
              <li className="sidebar__item" key={item.name}>
                  <span className="sidebar__name"> {item.name} </span>
              </li>
            );
          })}
        </ul>
        <label>
            <Button type="button" onClick={() =>{}}>
              Download Model
            </Button>
        </label>
        </div>
);
}


