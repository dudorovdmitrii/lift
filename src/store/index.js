import { createStore } from 'vuex';
import { startFloor, floorCount } from './../settings';

const store = createStore({
  state() {
    return {
      queue: [],
      floor: startFloor,
      cells: Array.from({ length: floorCount }, (val, ind) => ({ floor: floorCount - ind - 1, hasLift: floorCount - ind - 1 === startFloor ? true : false })),
    }
  },
  mutations: {
    updateQueue(state, payload) {
      switch (payload.action) {
        case 'shift': {
          state.queue.shift();
          break;
        }
        case 'push': {
          state.queue.push(payload.floor);
          break;
        }
      }
    },
    updateFloor(state, payload) {
      state.floor = payload.newFloor;
    },
    updateItems(state, payload) {
      const reversedPrevFloor = state.cells.length - payload.prevFloor - 1;
      const reversedNewFloor = state.cells.length - payload.newFloor - 1;
      state.cells[reversedPrevFloor].hasLift = false;
      state.cells[reversedNewFloor].hasLift = true;
    }
  },
});

export default store;
