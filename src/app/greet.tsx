'use client'

import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'



export default function Greet() {
  
  const [title, setTitle] =useState<string>("Empty message");

  useEffect(() => {
   
   invoke<string>('greet', { name: 'Next.js' })
      .then((value) => {
        console.log(value);
        setTitle(value);
      })
      .catch(console.error);
  }, [])

  // Necessary because we will have to use Greet as a component later.
  return <>{title}</>
}