import {FC, useEffect} from "react"
import {useMaybeRoomContext, useMediaDeviceSelect,useTrackToggle} from "@livekit/components-react";
import {FaMicrophone, FaChevronDown, FaVideo, FaVideoSlash} from "react-icons/fa"
import {PiMicrophoneSlashFill, PiMicrophoneFill} from "react-icons/pi"
import {Track} from "livekit-client";
import type {MediaDeviceSelectProps} from "@livekit/components-react";
import type {ToggleSource} from "@livekit/components-core";

interface Props extends MediaDeviceSelectProps{
  source: ToggleSource,
  onDeviceSelectError?: (e: Error) => void;
  exactMatch?: boolean;
}
const SelectMediaDropdown : FC<Props> = ({ kind , source, initialSelection, onActiveDeviceChange, onDeviceListChange, onDeviceSelectError, exactMatch, ...props}) => {
  const room = useMaybeRoomContext();
  const {devices, activeDeviceId, setActiveMediaDevice, className} = useMediaDeviceSelect({
    kind,
    room,
  });

  const {buttonProps, enabled} = useTrackToggle({source})

  useEffect(() => {
    if (initialSelection) {
      setActiveMediaDevice(initialSelection);
    }
  })

  useEffect(() => {
    if (typeof onDeviceListChange === 'function') {
      onDeviceListChange(devices);
    }
  }, [onDeviceListChange, devices]);

  useEffect(() => {
    onActiveDeviceChange?.(activeDeviceId);
  }, [activeDeviceId, onActiveDeviceChange]);

  const handleActiveDeviceChange = async (deviceId: string) => {
    try {
      await setActiveMediaDevice(deviceId, {exact: true});
    } catch (e) {
      if (e instanceof Error) {
        onDeviceSelectError?.(e);
      } else {
        throw e;
      }
    }
  };

  const disabledIcon = kind === 'videoinput' ? <FaVideoSlash/> : <PiMicrophoneSlashFill/>
  const enabledIcon = kind === 'videoinput' ? <FaVideo/> : <FaMicrophone/>

  return (
    <>
      <button type="button" className="btn m-1" onClick={buttonProps.onClick ? buttonProps.onClick : () => {}}>{enabled ? enabledIcon : disabledIcon}</button>
      <div className="dropdown">
        <label tabIndex={0} className="btn m-1"><FaChevronDown/></label>
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
          {devices.map((device) => (
            <li
              className={`text-w text-black ${device.deviceId === activeDeviceId && "text-blue-500"}`}
              key={device.deviceId}
              id={device.deviceId}
              // data-lk-active={device.deviceId === activeDeviceId}
              aria-selected={device.deviceId === activeDeviceId}
              role="option"
            >
              <span className="text-xs" onClick={() => handleActiveDeviceChange(device.deviceId)}>
                {device.label.substring(0, 40) + "..."}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default SelectMediaDropdown