import { MessageCircleIcon } from "lucide-react";

function NoConversationPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 sm:p-8 lg:p-12">
      <div className="relative mb-6 sm:mb-8">
        <div className="size-20 sm:size-24 lg:size-32 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
          <MessageCircleIcon className="size-10 sm:size-12 lg:size-16 text-cyan-400" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-xl" />
      </div>

      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-100 mb-3 sm:mb-4">
        Select a conversation
      </h3>
      <p className="text-slate-400 max-w-md text-sm sm:text-base lg:text-lg leading-relaxed">
        Choose a contact from the sidebar to start chatting or continue a
        previous conversation.
      </p>
    </div>
  );
}
export default NoConversationPlaceholder;
