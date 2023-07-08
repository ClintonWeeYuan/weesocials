import {FC, useState} from "react"
import ChatItem from "@/src/components/room/ChatItem";
import {LocalParticipant} from "livekit-client";
import {BsFillSendFill} from "react-icons/bs";
import {useChat, useRemoteParticipants} from "@livekit/components-react";

const Chatbox : FC  = () => {
  const {send, chatMessages, isSending} = useChat();

  const [message, setMessage] = useState("");


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

  return(
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
  )
}

export default Chatbox