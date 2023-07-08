import {motion} from "framer-motion"
import {ReactNode, FC} from "react";

interface Props {
  children : ReactNode
  onClick : () => void
}
const Backdrop : FC<Props> = ({children, onClick}) => {
  return (
    <motion.div onClick={onClick} className="fixed flex justify-center items-center w-screen h-screen px-8 py-6 z-30 top-0 left-0 backdrop" initial={{opacity: 0}} animate={{opacity: 1}}
                exit={{opacity: 0}}>{children}</motion.div>
  )
}

export default Backdrop