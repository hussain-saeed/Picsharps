import { useState, useEffect, useRef } from "react";
import { RiMore2Fill } from "react-icons/ri";

const UserActionsMenu = ({
  user,
  onDelete,
  onSuspend,
  onReactivate,
  onNotify,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // 1. غلق المنيو عند الضغط في أي مكان خارجي
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
    setIsOpen(false); // غلق المنيو عند اختيار أكشن
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
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
          {isActive ? (
            <>
              <button
                onClick={() => handleAction(onNotify)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
              >
                Send notification
              </button>
              <button
                onClick={() => handleAction(onSuspend)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
              >
                Suspend
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={() => handleAction(onDelete)}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleAction(onReactivate)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
              >
                Reactivate
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={() => handleAction(onDelete)}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
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
