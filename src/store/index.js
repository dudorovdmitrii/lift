import { createStore } from 'vuex';
import { liftCount, floorCount } from '@/settings';

const defaultInitialFloor = 0;
const initialLiftsOrder = new Array(liftCount).fill(true);
const initialShafts = Array.from({ length: liftCount }, () => new Array(floorCount));
let initialFloors = new Array(liftCount).fill(defaultInitialFloor);
let initialQueues = Array.from({ length: liftCount }, () => new Array());

if (localStorage.getItem('floors')) {
  const savedFloors = JSON.parse(localStorage.getItem('floors')).map(floor => parseInt(floor));
  if (savedFloors.length === liftCount && savedFloors[0].length === floorCount) initialFloors = savedFloors;
  else localStorage.removeItem('floors');
}
if (localStorage.getItem('queues')) {
  const savedQueues = JSON.parse(localStorage.getItem('queues'));
  if (savedQueues.length === liftCount) initialQueues = savedQueues;
  else localStorage.removeItem('queues');
}

for (let i = 0; i < liftCount; i++) {
  const shaft = initialShafts[i];
  for (let j = 0; j < floorCount; j++) {
    shaft[j] = { floor: floorCount - j - 1, hasLift: floorCount - j - 1 === initialFloors[i] ? true : false };
  }
}

const store = createStore({
  state() {
    return {
      queues: initialQueues,
      floors: initialFloors,
      shafts: initialShafts,
      freeLifts: initialLiftsOrder
    }
  },
  mutations: {
    updateQueue(state, payload) {
      switch (payload.action) {
        case 'shift': {
          state.queues[payload.shaftIndex].shift();
          break;
        }
        case 'push': {
          state.queues[payload.shaftIndex].push(payload.floor);
          break;
        }
      }
      localStorage.setItem('queues', JSON.stringify(state.queues));
    },
    updateFloor(state, payload) {
      state.floors[payload.shaftIndex] = payload.newFloor;
      localStorage.setItem('floors', JSON.stringify(state.floors));
    },
    updateItems(state, payload) {
      const reversedPrevFloor = state.shafts[payload.shaftIndex].length - payload.prevFloor - 1;
      const reversedNewFloor = state.shafts[payload.shaftIndex].length - payload.newFloor - 1;
      state.shafts[payload.shaftIndex][reversedPrevFloor].hasLift = false;
      state.shafts[payload.shaftIndex][reversedNewFloor].hasLift = true;
    },
    updatefreeLifts(state, payload) {
      state.freeLifts[payload.shaftIndex] = payload.isLiftFree;
    }
  },
});

export default store;
