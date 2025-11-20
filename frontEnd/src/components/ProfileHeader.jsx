import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { toast } from "react-hot-toast";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

export default function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const fileInputRef = useRef(null);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const base64Image = reader.result;
        setSelectedImg(base64Image);
        await updateProfile({ profilePic: base64Image });
      } catch (error) {
        toast.error("File size too large with new one some small");
      }
    };
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
      <div className="flex items-center justify-between gap-2">
        {/* Avatar & User Info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="relative">
            <button
              className="relative size-12 sm:size-14 lg:size-16 rounded-full overflow-hidden group flex-shrink-0 ring-2 ring-cyan-500/30 hover:ring-cyan-400/50 transition-all duration-300"
              onClick={() => fileInputRef?.current.click()}
            >
              <img
                src={
                  selectedImg ||
                  authUser?.profilePic ||
                  "/avatar.png"
                }
                alt="User"
                className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center pb-2 transition-opacity duration-300">
                <span className="text-white text-[10px] sm:text-xs font-medium">
                  Change
                </span>
              </div>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-slate-100 font-semibold text-sm sm:text-base lg:text-lg truncate">
              {authUser?.fullName}
            </h3>
            <p className="text-green-400 text-xs sm:text-sm flex items-center gap-1">
              <span className="size-1.5 bg-green-400 rounded-full animate-pulse" />
              Online
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1.5 sm:gap-2 lg:gap-3 items-center flex-shrink-0">
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              // play click sound before toggling
              mouseClickSound.currentTime = 0; // reset to start
              mouseClickSound
                .play()
                .catch((error) => console.log("Audio play failed:", error));
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>

          <button
            className="p-2 sm:p-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 active:scale-95"
            onClick={logout}
            title="Logout"
          >
            <LogOutIcon className="size-4 sm:size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
