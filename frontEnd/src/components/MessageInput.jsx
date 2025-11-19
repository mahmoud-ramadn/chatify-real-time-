import useKeyboardSound from "../hooks/useKeyboardSound";
import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";

function MessageInput() {
  const { playRandomStrokeSound } = useKeyboardSound();
  const { isSoundEnabled, sendMessage } = useChatStore();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  // Fix for iOS zoom issue and ensure input remains visible
  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      // Prevent zoom on focus in iOS
      input.setAttribute("style", "font-size: 16px;");
    }
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    if (isSoundEnabled) playRandomStrokeSound();
    sendMessage({
      text: text.trim(),
      image: imagePreview,
    });
    setText("");
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = null;

    // Refocus input after sending message
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Please select an image.");
      return;
    }

    // Check file size for mobile (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size too large. Please select an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.onerror = () => {
      toast.error("Failed to load image. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  // Handle keyboard on mobile
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    // Fixed: Better mobile padding and positioning
    <div className="bg-slate-900 border-t border-slate-700/50 safe-area-padding-bottom">
      {imagePreview && (
        <div className="max-w-3xl mx-auto px-4 pt-3 pb-2 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 xs:w-20 xs:h-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 border-2 border-slate-900"
              type="button"
              aria-label="Remove image"
            >
              <XIcon className="w-3 h-3" />
            </button>
          </div>
          <span className="ml-3 text-xs text-slate-400">
            Image ready to send
          </span>
        </div>
      )}

      {/* Fixed: Better responsive form layout */}
      <form
        onSubmit={handleSendMessage}
        className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2 sm:gap-3"
      >
        {/* Text Input - Fixed for mobile */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (isSoundEnabled && e.target.value.length > text.length) {
                playRandomStrokeSound();
              }
            }}
            onKeyPress={handleKeyPress}
            className="w-full bg-slate-800/80 border border-slate-700/50 rounded-xl py-3 px-4 text-sm sm:text-base focus:outline-none focus:border-cyan-500/50 focus:bg-slate-800 text-white placeholder-slate-400"
            placeholder="Type your message..."
            style={{ fontSize: "16px" }} // Prevents iOS zoom
          />
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
          capture="environment" // Better mobile camera handling
        />

        {/* Image upload button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
            imagePreview
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80 border border-slate-700/50"
          }`}
          aria-label="Attach image"
        >
          <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Send button - Fixed for mobile */}
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
          aria-label="Send message"
        >
          <SendIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </form>

      {/* Safe area spacer for mobile browsers */}
      <div
        className="h-1 bg-transparent sm:hidden"
        style={{ height: "env(safe-area-inset-bottom, 8px)" }}
      />
    </div>
  );
}

export default MessageInput;
