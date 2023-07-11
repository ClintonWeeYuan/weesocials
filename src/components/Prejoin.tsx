import { FC, LegacyRef, useEffect, useRef } from 'react';
import { usePreviewDevice } from '@livekit/components-react';

const Prejoin : FC = () => {
  const { selectedDevice, localTrack: videoTrack } = usePreviewDevice(true, '123', 'videoinput');
  const videoEl = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoEl && videoEl.current && videoTrack) {
      videoTrack.unmute();
      videoTrack.attach(videoEl.current!);
    }

    return () => {
      videoTrack && videoTrack.detach();
    };
  }, [videoTrack]);

  console.log(selectedDevice);
  return (
    <div className="bg-red-500 w-1/2">
      <video ref={videoEl as LegacyRef<HTMLVideoElement>} />
    </div>
  );
};

export default Prejoin;
