import {
  AudioVisualizer,
  LiveKitRoom,
  RoomAudioRenderer,
  useToken,
  useTracks,
  VideoTrack
} from '@livekit/components-react';
import {createLocalVideoTrack, LocalParticipant, LocalVideoTrack, RemoteParticipant, Room, Track} from 'livekit-client';
import {FC, ReactElement, useEffect, useState} from 'react';
import {VideoRenderer} from '@livekit/react-core';
import '@livekit/components-styles';
import {FaBolt} from "react-icons/fa";
import {NextPageWithLayout} from "@/src/pages/_app";
import SelectMediaDropdown from "@/src/components/SelectMediaDropdown";
import {LuLogOut} from "react-icons/lu"
import Topbar from "@/src/components/room/Topbar";
import Sidebar from "@/src/components/room/Sidebar"
import {getBaseUrl} from "@/src/utils";
import {HiChatBubbleLeftRight} from "react-icons/hi2"

const RoomPage: NextPageWithLayout = () => {
  // initial state from query parameters
  // const searchParams = new URLSearchParams(window.location.search);
  const storedUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL as string;
  const params = typeof window !== 'undefined' ? new URLSearchParams(location.search) : null;
  const roomName = params?.get('room') ?? 'test-room';
  const userIdentity = params?.get('user') ?? 'Unknown';
  const token = useToken(process.env.NEXT_PUBLIC_LK_TOKEN_ENDPOINT, roomName, {
    userInfo: {
      identity: userIdentity,
      name: userIdentity,
    },
  });

  // state to pass onto room
  const [url, setUrl] = useState(storedUrl);

  //Video
  const [videoTrack, setVideoTrack] = useState<LocalVideoTrack>();
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [videoDevice, setVideoDevice] = useState<MediaDeviceInfo>();

  //Audio
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [audioDevice, setAudioDevice] = useState<MediaDeviceInfo>();

  // disable connect button unless validated
  const [connectDisabled, setConnectDisabled] = useState(true);


  useEffect(() => {
    if (token && url) {
      setConnectDisabled(false);
    } else {
      setConnectDisabled(true);
    }
  }, [token, url]);

  const toggleVideo = async () => {
    if (videoTrack) {
      videoTrack.stop();
      setVideoEnabled(false);
      setVideoTrack(undefined);
    } else {
      const track = await createLocalVideoTrack({
        deviceId: videoDevice?.deviceId,
      });
      setVideoEnabled(true);
      setVideoTrack(track);
    }
  };

  const toggleAudio = () => {
    if (audioEnabled) {
      setAudioEnabled(false);
    } else {
      setAudioEnabled(true);
    }
  };

  const selectVideoDevice = (device: MediaDeviceInfo) => {
    setVideoDevice(device);
    if (videoTrack) {
      if (videoTrack.mediaStreamTrack.getSettings().deviceId === device.deviceId) {
        return;
      }
      // stop video
      videoTrack.stop();
    }
  };

  const connectToRoom = async () => {
    if (videoTrack) {
      videoTrack.stop();
    }

    // if (
    //   window.location.protocol === 'https:' &&
    //   url.startsWith('ws://') &&
    //   !url.startsWith('ws://localhost')
    // ) {
    //   alert('Unable to connect to insecure websocket from https');
    //   return;
    // }

    const params: { [key: string]: string } = {
      url,
      token: token ? token : "",
      videoEnabled: videoEnabled ? '1' : '0',
      audioEnabled: audioEnabled ? '1' : '0',
      simulcast: '0',
      dynacast: '0',
      adaptiveStream: '0',
    };
    if (audioDevice) {
      params.audioDeviceId = audioDevice.deviceId;
    }
    if (videoDevice) {
      params.videoDeviceId = videoDevice.deviceId;
    } else if (videoTrack) {
      // pass along current device id to ensure camera device match
      const deviceId = await videoTrack.getDeviceId();
      if (deviceId) {
        params.videoDeviceId = deviceId;
      }
    }
  };


  useEffect(() => {
    // enable video by default
    createLocalVideoTrack({
      deviceId: videoDevice?.deviceId,
    }).then((track) => {
      setVideoEnabled(true);
      setVideoTrack(track);
    });
  }, [videoDevice]);

  let videoElement: ReactElement;
  if (videoTrack) {
    videoElement = <VideoRenderer track={videoTrack} isLocal={true}/>;
  } else {
    videoElement = <div className="placeholder"/>;
  }


  const [room] = useState(new Room());

  const [connect, setConnect] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleDisconnect = () => {
    setConnect(false);
    setIsConnected(false);
  };


  return (
    <div className="flex flex-col w-full min-h-screen h-screen px-2 md:px-12 py-4 bg-base-300 ">
      <Topbar/>
      {
        isConnected ? (
          <LiveKitRoom
            room={room}
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            connect={connect}
            onConnected={() => setIsConnected(true)}
            onDisconnected={handleDisconnect}
            audio={true}
            video={true}
            className=""
          >
            <div className="relative h-full md:grid md:grid-cols-8 md:gap-6 bg-white rounded-2xl px-2 md:px-8 py-2 items-stretch">
              <div className="flex flex-col md:col-span-5">
                {/* Render a custom Stage component once connected */}
                {/*{isConnected && (*/}

                <RoomAudioRenderer/>
                <div>
                  <Stage setConnect={setConnect}/>
                  {/*<ControlBar className="relative w-full" />*/}
                </div>


                <div className="">
                  <input className="input input-bordered mr-2 text-black" disabled
                         value={`${getBaseUrl()}/waiting?room=${roomName}`}/>
                  <button className="btn btn-primary top-0 right-0" onClick={() => {
                    navigator.clipboard.writeText(`${getBaseUrl()}/waiting?room=${roomName}`)
                  }}>Invite
                  </button>
                </div>
              </div>

              <div className="hidden md:block relative col-span-3 h-full">
                <Sidebar/>
              </div>

              {/* You can open the modal using ID.showModal() method */}
              <div className="md:hidden absolute bottom-2 w-full flex justify-center">
                <label htmlFor="my_modal_6" className="btn btn-primary btn-circle btn-lg"><HiChatBubbleLeftRight/></label>
              </div>
              <input type="checkbox" id="my_modal_6" className="modal-toggle" />
              <div className="modal">
                <div className="modal-box h-full bg-base-300">
                  <label htmlFor="my_modal_6" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-20">✕</label>
                  <Sidebar/>
                </div>
              </div>
            </div>
          </LiveKitRoom>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <button className="btn btn-primary mb-4" onClick={() => {
              setConnect(true);
              setIsConnected(true);
            }}>
              Connect <FaBolt/>
            </button>
          </div>
        )
      }

    </div>
  );
};

interface StageProps {
  setConnect :  (value: (((prevState: boolean) => boolean) | boolean)) => void
}

export const Stage : FC<StageProps> = ({setConnect}) => {
  const tracks = useTracks([
    {source: Track.Source.Camera, withPlaceholder: true},
    // {source: Track.Source.ScreenShare, withPlaceholder: false},
  ]);
  console.log(tracks)
  return (
    <>
      <div className="relative mb-2">
        {/*<GridLayout className="" tracks={tracks}>*/}
        {/*  <TrackContext.Consumer>*/}
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
        {/*  </TrackContext.Consumer>*/}
        {/*</GridLayout>*/}
        <div className="absolute bottom-0 w-full flex justify-center py-2">
          <div className="flex justify-center">
            <SelectMediaDropdown kind="audioinput" source={Track.Source.Microphone}/>
            <SelectMediaDropdown kind="videoinput" source={Track.Source.Camera}/>
          </div>
          <button className="btn btn-sm md:btn-md btn-error" type="button" onClick={() => setConnect(false)}><LuLogOut/></button>
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

// RoomPage.getLayout = function useLayout(page: ReactElement) {
//   return <Layout>{page}</Layout>;
// };


export default RoomPage