import {FC, useState} from "react"
import {BsFillSendFill} from "react-icons/bs"
import {useChat, useRemoteParticipants} from '@livekit/components-react';
import ChatItem from "@/src/components/room/ChatItem";
import {LocalParticipant} from "livekit-client";
import {motion} from "framer-motion";

const Chatbox: FC = () => {
  const {send, chatMessages, isSending} = useChat();

  const [message, setMessage] = useState("");

  const [isChat, setIsChat] = useState(true);

  const participants = useRemoteParticipants();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    console.log(message)
    if (message && message.trim() !== '') {
      if (send) {
        await send(message);
        setMessage("");
        console.log(chatMessages)
      }
    }
  }

  return (
    <div className="absolute flex flex-col bg-base-300 w-full h-full rounded-2xl px-4 py-2">
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
        isChat ?  (
          <>
            <div className="h-5/6 overflow-y-scroll scrollbar">
              {chatMessages.map((msg, index) => (
                <div key={index}>
                  <ChatItem message={msg.message} sender={msg.from?.name!}
                            isLocal={msg.from instanceof LocalParticipant}/>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="relative">
              <input value={message} onChange={(e) => setMessage(e.currentTarget.value)}
                     placeholder="Type message here..." className="input w-full"/>
              <button type="submit" className="absolute top-0 right-2 btn btn-circle btn-md btn-primary"><BsFillSendFill/>
              </button>
            </form>
          </>
        ) :
          (
            <div className="flex flex-col py-4 px-4">
              {participants.map((participant, index) => (
                <div key={index} className="flex items-center mb-4">
                  <div className="bg-green-500 h-3 w-3 rounded-full mr-4"></div>
                  <p className="text-lg text-gray-700">{participant.name}</p>
                </div>
              ))}
            </div>
          )
      }

    </div>
  )
}

export default Chatbox;