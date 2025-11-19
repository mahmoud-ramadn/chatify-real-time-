import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",
  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (user) => set({ selectedUser: user }),
  getAllContacts: async () => {
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ isUserLoading: true });
      set({ allContacts: res.data });
    } catch (error) {
      toast.error("Failed to fetch contacts");
    } finally {
      set({ isUserLoading: false });
    }
  },
  getMyChatPartners: async () => {
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ isUserLoading: true });
      set({ chats: res.data });
    } catch (error) {
      toast.error("Failed to fetch chat partners");
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ isMessageLoading: true });
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong");
    } finally {
      set({ isMessageLoading: false });
    }
  },
}));
