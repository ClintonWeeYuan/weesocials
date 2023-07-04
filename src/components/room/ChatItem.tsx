import {FC} from "react"

interface Props {
  message: string,
  sender: string,
  isLocal: boolean,
}

const ChatItem: FC<Props> = ({message, sender, isLocal}) => {

  return (
    <div className={`chat chat-${isLocal ? "end" : "start"}`}>
      {/*<div className="chat-image avatar">*/}
      {/*  <div className="w-10 rounded-full">*/}
      {/*    <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg"/>*/}
      {/*  </div>*/}
      {/*</div>*/}
      <div className="chat-header">
        {sender}
        <time className="text-xs opacity-50 ml-2">12:45</time>
      </div>
      <div className="chat-bubble">{message}</div>
      {/*<div className="chat-footer opacity-50">*/}
      {/*  Delivered*/}
      {/*</div>*/}
    </div>
  )
}

export default ChatItem;