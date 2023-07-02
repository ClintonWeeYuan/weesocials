import {
  AudioVisualizer,
  GridLayout,
  LiveKitRoom,
  ParticipantName,
  RoomAudioRenderer,
  TrackContext,
  useConnectionQualityIndicator,
  useToken,
  useTracks,
  VideoTrack,
  MediaDeviceSelect
} from '@livekit/components-react';
import {ConnectionQuality, createLocalVideoTrack, LocalVideoTrack, Room, Track} from 'livekit-client';
import {HTMLAttributes, ReactElement, useEffect, useState} from 'react';
import {VideoRenderer} from '@livekit/react-core';
import '@livekit/components-styles';
import {FaBolt} from "react-icons/fa";
import {NextPageWithLayout} from "@/src/pages/_app";
import Layout from "@/src/components/Layout";
import SelectMediaDropdown from "@/src/components/SelectMediaDropdown";


const CustomizeExample: NextPageWithLayout = () => {
  // initial state from query parameters
  // const searchParams = new URLSearchParams(window.location.search);
  const storedUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL as string;
  const params = typeof window !== 'undefined' ? new URLSearchParams(location.search) : null;
  const roomName = params?.get('room') ?? 'test-room';
  const userIdentity = params?.get('user') ?? 'test-identity';
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
    console.log("HELLO")
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
    <div className="flex flex-col justify-center items-center relative min-h-screen max-w-screen-sm "
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
            <Stage/>
            {/*<ControlBar className="relative w-full" />*/}
          </div>
        )}
      </LiveKitRoom>
    </div>
  );
};

export function Stage() {
  const tracks = useTracks([
    {source: Track.Source.Camera, withPlaceholder: true},
    // {source: Track.Source.ScreenShare, withPlaceholder: false},
  ]);
  console.log(tracks)
  return (
    <>
      <div className="bg-red-500">
        {/*<GridLayout className="bg-green-500" tracks={tracks}>*/}
        {/*  <TrackContext.Consumer>*/}
          {/*  {(track) =>*/}
          {/*    track && (*/}
          {tracks.map((track, index) => (
            <div key={index} className="bg-blue-500">
              <div>
                <VideoTrack {...track} />
              </div>
              <div className="flex justify-center relative">
                {/*<div className="flex h-20 w-20 bg-red-500">*/}
                {/*</div>*/}
                {/* Overwrite styles: By passing class names, we can easily overwrite/extend the existing styles. */}
                {/* In addition, we can still specify a style attribute and further customize the styles. */}
                {/*<ParticipantName*/}
                {/*  className="text-black mt-5"*/}
                {/*/>*/}
                {/* Custom components: Here we replace the provided <ConnectionQualityIndicator />  with our own implementation. */}
                {/*<UserDefinedConnectionQualityIndicator />*/}
              </div>
              <div className="bg-yellow-500 w-full flex">
                <SelectMediaDropdown kind="audioinput" source={Track.Source.Microphone}/>
                <SelectMediaDropdown kind="videoinput" source={Track.Source.Camera}/>
              </div>
              {/*<MediaDeviceSelect kind="audioinput" onActiveDeviceChange={() => {console.log("Hello")}}/>*/}

            </div>
          ))}
            {/*  )*/}
            {/*}*/}
          {/*</TrackContext.Consumer>*/}
        {/*</GridLayout>*/}
      </div>
    </>
  );
}

export function UserDefinedConnectionQualityIndicator(props: HTMLAttributes<HTMLSpanElement>) {
  /**
   *  We use the same React hook that is used internally to build our own component.
   *  By using this hook, we inherit all the state management and logic and can focus on our implementation.
   */
  const {quality} = useConnectionQualityIndicator();

  function qualityToText(quality: ConnectionQuality): string {
    switch (quality) {
      case ConnectionQuality.Unknown:
        return 'No idea';
      case ConnectionQuality.Poor:
        return 'Poor';
      case ConnectionQuality.Good:
        return 'Good';
      case ConnectionQuality.Excellent:
        return 'Excellent';
    }
  }

  return <span {...props}> {qualityToText(quality)} </span>;
}

CustomizeExample.getLayout = function useLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};


export default CustomizeExample