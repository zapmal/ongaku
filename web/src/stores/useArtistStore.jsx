import create from 'zustand';

export const useArtistStore = create((set) => ({
  information: {
    basic: {},
    artistic: {}
  },
  setBasicInformation: (basicInfo) => {
    set((state) => ({
      information: {
        ...state.information,
        basic: basicInfo,
      }
    }));
  },
  setArtisticInformation: (artisticInfo) => {
    set((state) => ({
      information: {
        ...state.information,
        artistic: artisticInfo,
      }
    }));
  },
  removeInformation: () => {
    set({ information: {} });
  },
}));