import {LiveKitRoom, RoomAudioRenderer, useToken} from '@livekit/components-react';
import {createLocalVideoTrack, LocalVideoTrack, Room} from 'livekit-client';
import {ReactElement, useEffect, useState} from 'react';
import {VideoRenderer} from '@livekit/react-core';
import '@livekit/components-styles';
import {FaBolt} from "react-icons/fa";
import {NextPageWithLayout} from "@/src/pages/_app";
import Topbar from "@/src/components/room/Topbar";
import Sidebar from "@/src/components/room/Sidebar"
import {HiChatBubbleLeftRight} from "react-icons/hi2"
import {AnimatePresence, motion} from "framer-motion";
import Modal from "@/src/components/modal/Modal";
import Layout from "@/src/components/Layout";
import Stage from "@/src/components/room/Stage";

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

  //Get base url
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';

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

  //Control Modal
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);


  useEffect(() => {
    if (token && url) {
      setConnectDisabled(false);
    } else {
      setConnectDisabled(true);
    }
  }, [token, url]);

  const connectToRoom = async () => {
    if (videoTrack) {
      videoTrack.stop();
    }

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
    <div className="flex flex-col w-full h-screen px-2 md:px-12 py-4 bg-base-300 ">
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
            <div
              className="relative h-full md:grid md:grid-cols-8 md:gap-6 bg-white rounded-2xl px-2 md:px-8 py-2">
              <div className="md:col-span-5">
                <RoomAudioRenderer/>
                <div>
                  <Stage setConnect={setConnect}/>
                </div>
                <div className="">
                  <input className="input input-bordered mr-2 text-black" disabled
                         value={`${origin}/waiting?room=${roomName}`}/>
                  <button className="btn btn-primary top-0 right-0" onClick={() => {
                    navigator.clipboard.writeText(`${origin}/waiting?room=${roomName}`)
                  }}>Invite
                  </button>
                </div>
              </div>

              <div className="hidden md:block relative col-span-3 h-full">
                <Sidebar/>
              </div>

              {/*Modal */}
              <div className="md:hidden flex w-full justify-center absolute bottom-2">
                <motion.button whileHover={{scale: 1.1}}
                               whileTap={{scale: 0.9}}
                               className="btn btn-primary btn-circle"
                               onClick={openModal}
                               type="button"
                >
                  <HiChatBubbleLeftRight/>
                </motion.button>
              </div>
              <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
                {modalOpen && <Modal handleClose={closeModal}><Sidebar/></Modal>}
              </AnimatePresence>
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


RoomPage.getLayout = function useLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};


export default RoomPage