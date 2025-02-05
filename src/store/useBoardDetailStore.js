import { create } from 'zustand';


const useBoardDetailStore = create(set => ({
  boardDetail: null,
  setBoardDetail: (boardDetail) => {
    set({boardDetail})
  },
}))

export default useBoardDetailStore;