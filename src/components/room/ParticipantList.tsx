import {FC} from "react"
import {RemoteParticipant} from "livekit-client";
import {useRemoteParticipants} from "@livekit/components-react";


const ParticipantList : FC = () => {
  const participants = useRemoteParticipants();

  return (
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

export default ParticipantList