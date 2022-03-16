import create from 'zustand';

export const useRoomStore = create((set) => ({
  room: [],
  setRoom: (room) => {
    set({ room });
  },
}));
