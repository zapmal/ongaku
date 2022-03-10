import LinkedList from 'dbly-linked-list';
import create from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export const useQueueStore = create(
  subscribeWithSelector((set, get) => ({
    queue: new LinkedList(),
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

      set({ queue: newQueue });
    },
    remove: (song) => {
      get().queue.removeNode(song);

      set({ queue: get().queue });
    },
  }))
);
