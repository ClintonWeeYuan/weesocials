import {FC} from "react"
import {FaChevronLeft} from "react-icons/fa"

const Topbar: FC = () => {

  return (
    <div className="flex items-center w-full px-4 py-2 bg-white rounded-full text-black mb-2">
      <button className="btn btn-ghost btn-circle text-gray-500 mr-2 md:mr-4"><FaChevronLeft className="text-2xl md:text-4xl"/></button>
      <div>
        <p className="text-xl md:text-3xl">Topbar Heading 1</p>
        <p className="text-xs md:text-sm text-gray-500">Someone&apos;s Meeting Room</p>
      </div>
    </div>
  )
}

export default Topbar;