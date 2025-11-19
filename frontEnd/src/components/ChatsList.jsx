import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

export function UserListItem({ user, isOnline, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 bg-slate-800/30 hover:shadow-lg hover:shadow-cyan-500/10 active:scale-[0.98]"
    >
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <div
            className={`size-11 sm:size-12 lg:size-14 rounded-full ring-2 transition-all duration-300 ${
              isOnline
                ? "ring-green-500/50 group-hover:ring-green-400"
                : "ring-slate-600/50 group-hover:ring-slate-500"
            }`}
          >
            <img
              src={user?.profilePic || "/api/placeholder/56/56"}
              alt={user?.fullName}
              className="size-full rounded-full object-cover"
            />
          </div>
          <div
            className={`absolute -bottom-0.5 -right-0.5 size-3 sm:size-3.5 rounded-full border-2 border-slate-900 ${
              isOnline ? "bg-green-500" : "bg-slate-500"
            }`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-slate-100 font-medium text-sm sm:text-base truncate group-hover:text-cyan-400 transition-colors">
            {user?.fullName}
          </h4>
          <p className="text-slate-500 text-xs sm:text-sm">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="size-2 bg-cyan-400 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (!Array.isArray(chats) || chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat?._id}
          className="bg-cyan-500/10 p-3 md:p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors active:bg-cyan-500/30"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">
            <div
              className={`avatar ${
                (onlineUsers ?? []).includes(chat?._id) ? "online" : "offline"
              }`}
            >
              <div className="size-10 md:size-12 rounded-full flex-shrink-0">
                <img
                  src={chat?.profilePic || "/avatar.png"}
                  alt={chat?.fullName}
                />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate text-sm md:text-base">
              {chat?.fullName}
            </h4>
          </div>
        </div>
      ))}
    </>
  );
}
