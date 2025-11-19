import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessageLoadingSkeleton";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Fetch messages when user is selected
  useEffect(() => {
    if (selectedUser?._id) {
      getMessagesByUserId(selectedUser._id);
    }
  }, [selectedUser?._id, getMessagesByUserId]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (selectedUser?._id && subscribeToMessages && unsubscribeFromMessages) {
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    }
  }, [selectedUser?._id, subscribeToMessages, unsubscribeFromMessages]);

  // Improved auto-scroll with better mobile support
  useEffect(() => {
    if (messagesEndRef.current && messages?.length > 0) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
    }
  }, [messages]);

  // Safe date formatter
  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";

    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "Just now";

      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Just now";
    }
  };

  return (
    // Fixed: Use h-screen on mobile and proper height management
    <div className="flex flex-col h-screen w-full bg-slate-900">
      <ChatHeader />

      {/* Fixed: Better mobile scrolling container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 bg-gradient-to-b from-slate-900/50 to-slate-900/80"
        style={{
          WebkitOverflowScrolling: "touch", // Better iOS scrolling
          height: "calc(100vh - 140px)", // Ensure proper height calculation
        }}
      >
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages && messages.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 md:space-y-6 pb-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${
                  msg.senderId === authUser._id ? "chat-end" : "chat-start"
                }`}
              >
                {/* Avatar */}
                <div className="chat-image avatar">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-slate-700/50 overflow-hidden flex-shrink-0">
                    <img
                      src={
                        msg.senderId === authUser._id
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Message Bubble */}
                <div
                  className={`chat-bubble max-w-[85%] xs:max-w-[80%] sm:max-w-[85%] md:max-w-md break-words shadow-lg ${
                    msg.senderId === authUser._id
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                      : "bg-slate-800 text-slate-200 border border-slate-700/50"
                  }`}
                >
                  {msg.image && (
                    <div className="mb-2 rounded-lg overflow-hidden">
                      <img
                        src={msg.image}
                        alt="Shared"
                        className="w-full max-w-[200px] xs:max-w-[250px] sm:max-w-xs h-auto object-cover"
                      />
                    </div>
                  )}
                  {msg.text && (
                    <p className="text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>
                  )}

                  {/* Timestamp */}
                  <div
                    className={`text-[10px] sm:text-xs mt-1.5 flex items-center gap-1 ${
                      msg.senderId === authUser._id
                        ? "opacity-80"
                        : "opacity-60"
                    }`}
                  >
                    <span>{formatTime(msg.createdAt)}</span>
                    {msg.senderId === authUser._id && (
                      <svg
                        className="w-3 h-3 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {/* Scroll anchor */}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser?.fullName || "User"} />
        )}
      </div>

      {/* Fixed: Ensure MessageInput is properly positioned */}
      <div className="sticky bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700/50">
        <MessageInput />
      </div>
    </div>
  );
}

export default ChatContainer;
