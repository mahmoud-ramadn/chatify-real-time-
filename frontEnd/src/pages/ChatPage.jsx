import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import { useChatStore } from "../store/useChatStore";
import { ArrowLeft } from "lucide-react";

export default function ChatPage() {
  const { activeTab, selectedUser, setSelectedUser } = useChatStore();

  return (
    <div className="relative w-full max-w-6xl md:h-[800px] min-h-screen mx-auto">
      <BorderAnimatedContainer>
        {/* LEFT SIDE - Hidden on mobile when chat is selected */}
        <div
          className={`
          w-full md:w-80 
          bg-slate-800/50 backdrop-blur-sm 
          flex flex-col
          ${selectedUser ? "hidden md:flex" : "flex"}
        `}
        >
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT SIDE - Full width on mobile when chat is selected */}
        <div
          className={`
          flex-1 
          flex flex-col 
          bg-slate-900/50 backdrop-blur-sm
          ${selectedUser ? "flex" : "hidden md:flex"}
        `}
        >
          {selectedUser && (
            <div className="md:hidden p-4 border-b border-slate-700/50 bg-slate-800/50">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <ArrowLeft className="size-5" />
                <span>Back to chats</span>
              </button>
            </div>
          )}

          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
