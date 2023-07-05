import {NextPage} from "next";
import { useSearchParams } from 'next/navigation'
import Link from "next/link";
import {useState} from "react";
const WaitingRoom : NextPage = () => {

  const searchParams = useSearchParams();

  const roomName = searchParams.get("room");

  const [name, setName] = useState("")

  return (
    <main className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="flex flex-col md:flex-row mb-4">
        <input type="text" placeholder="Your name..." onChange={(e) => {setName(e.currentTarget.value)}} className="input input-accent w-full max-w-xs"/>
        <Link href={`/room?user=${name}&room=${roomName}`} className="btn btn-accent ml-0 mt-2 md:mt-0 md:ml-2">Enter Room</Link>
      </div>
    </main>
  )
}

export default WaitingRoom