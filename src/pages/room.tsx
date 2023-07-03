import {
  AudioVisualizer,
  GridLayout,
  LiveKitRoom,
  RoomAudioRenderer,
  TrackContext,
  useToken,
  useTracks,
  VideoTrack
} from '@livekit/components-react';
import {createLocalVideoTrack, LocalVideoTrack, Room, Track} from 'livekit-client';
import {ReactElement, useEffect, useState} from 'react';
import {VideoRenderer} from '@livekit/react-core';
import '@livekit/components-styles';
import {FaBolt} from "react-icons/fa";
import {NextPageWithLayout} from "@/src/pages/_app";
import Layout from "@/src/components/Layout";
import SelectMediaDropdown from "@/src/components/SelectMediaDropdown";
import {LuLogOut} from "react-icons/lu"


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
    <div className="flex flex-col justify-center items-center relative min-h-screen max-w-screen-sm"
         data-lk-theme="default">
      <h1 className="text-5xl text-black p-4">
        Wee Socials
      </h1>
      {!isConnected && (
        <button className="btn btn-primary" onClick={() => setConnect(!connect)}>
          Connect <FaBolt/>
        </button>
      )}
      <LiveKitRoom
        room={room}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect={connect}
        onConnected={() => setIsConnected(true)}
        onDisconnected={handleDisconnect}
        audio={true}
        video={true}
      >
        <RoomAudioRenderer/>
        {/* Render a custom Stage component once connected */}
        {isConnected && (
          <div className="">
            <Stage setConnect={setConnect}/>
            {/*<ControlBar className="relative w-full" />*/}
          </div>
        )}
      </LiveKitRoom>
      <div className="">
      <input className="input input-bordered mr-2 text-black" disabled value={`http://localhost:3000/room?room=${roomName}`}/>
      <button className="btn btn-primary top-0 right-0" onClick={() => {navigator.clipboard.writeText(`http://localhost:3000/room?room=${roomName}`)}}>Invite</button>
      </div>
    </div>
  );
};

export function Stage({setConnect}) {
  const tracks = useTracks([
    {source: Track.Source.Camera, withPlaceholder: true},
    // {source: Track.Source.ScreenShare, withPlaceholder: false},
  ]);
  console.log(tracks)
  return (
    <>
      <div className="bg-white">
        <GridLayout className="" tracks={tracks}>
          <TrackContext.Consumer>
            {(track) =>
              track && (

                <div className="">
                  <div className="relative">
                    <div className="w-16 h-16 absolute top-0 right-0 z-10"><AudioVisualizer
                      participant={track.participant}/>
                    </div>
                    <VideoTrack {...track} />
                  </div>
                  <div className="flex justify-center relative">
                  </div>
                </div>

              )
            }
          </TrackContext.Consumer>
        </GridLayout>
        <div className="w-full flex justify-between py-2">
          <div className="flex">
            <SelectMediaDropdown kind="audioinput" source={Track.Source.Microphone}/>
            <SelectMediaDropdown kind="videoinput" source={Track.Source.Camera}/>
          </div>
          <button className="btn btn-error" type="button" onClick={() => setConnect(false)}><LuLogOut/></button>
        </div>

      </div>
    </>
  );
}

RoomPage.getLayout = function useLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};


export default RoomPage