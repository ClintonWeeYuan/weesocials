import { FC } from "react"
import hdate from "human-date"

interface Props {
  message: string,
  sender: string,
  isLocal: boolean,
  date: number,
}

const ChatItem: FC<Props> = ({ message, sender, isLocal, date }) => {
  const convertTime = (date: number) => {
    return hdate.relativeTime((date - Date.now()) / 1000);
  }
  return (

    <div className={`chat chat-${isLocal ? "end" : "start"}`}>
      <div className="chat-header">
        {sender}
        <time className="text-xs opacity-50 ml-2">{convertTime(date)}</time>
      </div>
      <div className="chat-bubble">{message}</div>
    </div>
  )
}

export default ChatItem;