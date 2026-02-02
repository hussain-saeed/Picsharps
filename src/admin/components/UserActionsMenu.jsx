import { useState, useEffect, useRef } from "react";
import { RiMore2Fill } from "react-icons/ri";
import { CiMail } from "react-icons/ci";
import { TbHandStop } from "react-icons/tb";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { BiLike } from "react-icons/bi";

const UserActionsMenu = ({
  user,
  onDelete,
  onSuspend,
  onReactivate,
  onNotify,
  index,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleAction = (cb) => {
    setIsOpen(false);
    cb?.(user);
  };

  const isActive = user.status === "Active";

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* زرار الفتح */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer text-xl p-1 hover:bg-gray-100 rounded-full transition-colors flex items-center"
      >
        <RiMore2Fill />
      </button>

      {/* القائمة (المنيو) */}
      {isOpen && (
        <div
          style={{ border: "2px solid rgb(230, 230, 230)" }}
          className={`absolute top-7 right-3 w-48 bg-white rounded-xl shadow-2xl z-50 overflow-hidden`}
        >
          {isActive ? (
            <>
              <button
                onClick={() => handleAction(onNotify)}
                className="text-blue-500 flex items-center font-semibold gap-2 w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors"
                style={{ borderBottom: "1px solid rgb(230, 230, 230)" }}
              >
                <MdOutlineEmail className="text-xl" />
                Send Notification
              </button>
              <button
                onClick={() => handleAction(onSuspend)}
                className="text-orange-600 flex items-center font-semibold gap-2 w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors"
                style={{ borderBottom: "1px solid rgb(230, 230, 230)" }}
              >
                <TbHandStop className="text-xl" />
                Suspend
              </button>
              <button
                onClick={() => handleAction(onDelete)}
                className="text-red-600 flex items-center font-semibold gap-2 w-full text-left px-4 py-4 text-sm hover:bg-blue-50 transition-colors"
              >
                <FaRegTrashAlt className="text-xl" />
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleAction(onReactivate)}
                className="text-green-500 flex items-center font-semibold gap-2 w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors"
                style={{ borderBottom: "1px solid rgb(230, 230, 230)" }}
              >
                <BiLike className="text-xl" />
                Reactivate
              </button>
              <button
                onClick={() => handleAction(onDelete)}
                className="text-red-600 flex items-center font-semibold gap-2 w-full text-left px-4 py-4 text-sm hover:bg-blue-50 transition-colors"
              >
                <FaRegTrashAlt className="text-xl" />
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserActionsMenu;
