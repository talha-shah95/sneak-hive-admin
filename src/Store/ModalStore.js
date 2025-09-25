// useModalStore.js
import { create } from 'zustand';

const useModalStore = create((set) => ({
  isOpen: false,
  type: null, // 'success', 'info', 'question', etc.
  modalProps: {}, // Central place for all modal content

  // showModal: ({ type = 'info', modalProps = {} }) =>
  //   set({ isOpen: true, type, modalProps }),

  showModal: ({ type, modalProps }) => {
    // Close existing modal first (if any), then after delay, open new modal
    set({ isOpen: false, type: null, modalProps: {} });
    setTimeout(() => {
      set({ isOpen: true, type, modalProps });
    }, 100); // Delay to ensure modal unmount/mount cleanly
  },

  closeModal: () => set({ isOpen: false, modalProps: {}, type: 'info' }),
}));

export default useModalStore;
