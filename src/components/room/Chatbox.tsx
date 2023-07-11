import { FC, FormEvent, useState } from 'react';
import { LocalParticipant } from 'livekit-client';
import { BsFillSendFill } from 'react-icons/bs';
import { useChat } from '@livekit/components-react';
import ChatItem from '@/src/components/room/ChatItem';
import useChatScroll from '@/src/components/hooks/useChatScroll';

const Chatbox : FC = () => {
  const { send, chatMessages } = useChat();

  const [message, setMessage] = useState('');

  const ref = useChatScroll(chatMessages);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (message && message.trim() !== '') {
      if (send) {
        await send(message);
        setMessage('');
        console.log(chatMessages);
      }
    }
  }

  return (
    <>
      <div ref={ref} className="h-5/6 overflow-y-scroll scrollbar">
        {chatMessages.map((msg) => (
          <div key={msg.timestamp} className="">
            <ChatItem
              message={msg.message}
              sender={msg.from?.name ? msg.from.name : ""}
              date={msg.timestamp}
              isLocal={msg.from instanceof LocalParticipant}
            />
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="relative">
        <input
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
          placeholder="Type message here..."
          className="input w-full"
        />
        <button type="submit" className="absolute top-0 right-2 btn btn-circle btn-md btn-primary">
          <BsFillSendFill />
        </button>
      </form>
    </>
  );
};

export default Chatbox;
