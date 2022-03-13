import LinkedList from 'dbly-linked-list';
import create from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export const useQueueStore = create(
  subscribeWithSelector((set, get) => ({
    queue: new LinkedList(),
    currentlyPlaying: { artist: {}, album: {} },
    add: (songs) => {
      const newQueue = get().queue;

      if (newQueue.isEmpty()) {
        songs.map((song) => newQueue.insert(song));
      } else {
        songs.map((song) => {
          if (newQueue.find(song) === -1) {
            newQueue.insert(song);
          }
        });
      }

      set({ queue: newQueue, currentlyPlaying: newQueue.getHeadNode().getData() });
    },
    setCurrentlyPlaying: (song) => set({ currentlyPlaying: song }),
    remove: (song) => {
      const currentlyPlaying = get().currentlyPlaying;
      get().queue.removeNode(song);

      if (song === currentlyPlaying) {
        if (get().queue.getHeadNode()) {
          set({ currentlyPlaying: get().queue.getHeadNode().getData() });
        } else {
          set({ currentlyPlaying: { artist: {}, album: {} } });
        }
      }

      set({ queue: get().queue });
    },
    removeHeadNode: () => {
      get().queue.removeFirst();

      set({ queue: get().queue });
    },
    shuffle: () => {
      const newQueue = new LinkedList();

      get()
        .queue.toArray()
        .sort(() => (Math.random() > 0.5 ? 1 : -1))
        .map((song) => {
          newQueue.insert(song);
        });

      set({ queue: newQueue });
    },
    clearQueue: () => {
      set({ queue: new LinkedList() });
    },
  }))
);
