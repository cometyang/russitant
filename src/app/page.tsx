import Image from 'next/image';
import Link from 'next/link';
import Greet from './greet';

export default function Home() {
  return (
    <main className="w-full h-full p-4">
      <div className="flex flex-col items-center justify-between w-full h-full p-4 bg-black rounded-xl p-4">
        <Greet />
      </div>
    </main>
  )
}
