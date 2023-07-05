import {FC, useState} from "react"
import {motion} from "framer-motion";
import ParticipantList from "@/src/components/room/ParticipantList";
import Chatbox from "@/src/components/room/Chatbox";

const Sidebar: FC = () => {

  const [isChat, setIsChat] = useState(true);

  return (
    <div className="md:absolute flex flex-col bg-base-300 w-full h-full rounded-2xl px-4 py-2">
      <div className="relative flex w-full bg-white rounded-full">
        {isChat ? (<motion.div
          layoutId="underline"
          className="absolute top-0 left-0 w-1/2 h-full bg-gray-800 rounded-full"
        />) : (<motion.div
          layoutId="underline"
          className="absolute top-0 right-0 w-1/2 h-full bg-gray-800 rounded-full"
        />)}

        <button onClick={() => setIsChat(true)} className="rounded-full z-20 w-1/2 h-full py-4">
          <p className={`ease-in duration-500 ${isChat ? "text-white" : "text-black"}`}>ChatBox</p>
        </button>
        <button onClick={() => setIsChat(false)} className="rounded-full z-20 w-1/2 h-full py-4">
          <p className={`ease-in duration-500 ${!isChat ? "text-white" : "text-black"}`}>Participants</p>
        </button>

      </div>

      {
        isChat ? (
            <Chatbox/>
          ) :
          <ParticipantList/>
      }

    </div>
  )
}

export default Sidebar;