import { createStore } from 'vuex';
import { initialFloor, floorCount, initialQueue } from './../settings';

const store = createStore({
  state() {
    return {
      queue: initialQueue,
      floor: initialFloor,
      cells: Array.from({ length: floorCount }, (val, ind) => ({ floor: floorCount - ind - 1, hasLift: floorCount - ind - 1 === initialFloor ? true : false })),
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
      localStorage.setItem('queue', JSON.stringify(state.queue));
    },
    updateFloor(state, payload) {
      state.floor = payload.newFloor;
      localStorage.setItem('floor', payload.newFloor.toString());
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
