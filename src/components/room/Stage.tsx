import {FC} from "react";
import {AudioVisualizer, useTracks, VideoTrack} from "@livekit/components-react";
import {LocalParticipant, RemoteParticipant, Track} from "livekit-client";
import SelectMediaDropdown from "@/src/components/SelectMediaDropdown";
import {LuLogOut} from "react-icons/lu";

interface StageProps {
  setConnect: (value: (((prevState: boolean) => boolean) | boolean)) => void
}

export const Stage: FC<StageProps> = ({setConnect}) => {
  const tracks = useTracks([
    {source: Track.Source.Camera, withPlaceholder: true},
    // {source: Track.Source.ScreenShare, withPlaceholder: false},
  ]);

  return (
    <>
      <div className="relative mb-2">
        {tracks.map((track, index) =>
            track.participant instanceof LocalParticipant && (
              <div key={index} className="">
                <div className="relative">
                  <div className="w-16 h-16 absolute top-0 right-0 z-10"><AudioVisualizer
                    participant={track.participant}/>
                  </div>
                  <VideoTrack className="rounded-2xl" {...track} />
                </div>
                <div className="flex justify-center relative">
                </div>
              </div>
            )
        )}
        <div className="absolute bottom-0 w-full flex justify-center py-2">
          <div className="flex justify-center">
            <SelectMediaDropdown kind="audioinput" source={Track.Source.Microphone}/>
            <SelectMediaDropdown kind="videoinput" source={Track.Source.Camera}/>
          </div>
          <button className="btn btn-sm md:btn-md btn-error" type="button" onClick={() => setConnect(false)}><LuLogOut/>
          </button>
        </div>
      </div>
      <div>
        <div className="w-full">
          <div className="carousel carousel-center w-full space-x-4 rounded-box">
            {tracks.map((track, index) =>
                track.participant instanceof RemoteParticipant && (
                  <div key={index} className="carousel-item aspect-video h-32">
                    <VideoTrack className="rounded-2xl" {...track} />
                    <div className="flex justify-center relative">
                    </div>
                  </div>
                )
            )}
          </div>
        </div>

      </div>
    </>
  );
}
export default Stage