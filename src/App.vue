<template>
  <main class="layout">
    <lift-column v-for="(val, i) in shafts.length" :key="i" :shaftIndex="i">
    </lift-column>
    <div class="actionList">
      <button v-for="(val, i) in floorCount" :key="i" @click="addFloor(floorCount - i - 1)" :class="[
                'actionList_action', 
                {
      'active': isButtonActive(floorCount - i - 1)
      }
      ]">
        {{floorCount - i}}
      </button>
    </div>
  </main>
</template>

<script>
import store from './store';
import LiftColumn from './components/LiftColumn.vue';
import { floorCount, liftCount } from './settings';

export default {
  name: 'App',
  computed: {
    shafts() {
      return store.state.shafts;
    },
    queues() {
      return store.state.queues;
    },
    floorCount() {
      return floorCount;
    },
    freeLifts() {
      return store.state.freeLifts;
    },
    floors() {
      return store.state.floors;
    },
  },
  components: { LiftColumn },
  methods: {
    addFloor(floor) {
      if (this.floors.includes(floor) || this.isButtonActive(floor)) return;

      const liftIndex = this.closestLiftIndex(floor);
      if (this.freeLifts[liftIndex]) store.commit('updatefreeLifts', { shaftIndex: liftIndex, isLiftFree: false });
      store.commit('updateQueue', { action: 'push', shaftIndex: liftIndex, floor });
    },
    isButtonActive(floor) {
      for (const queue of this.queues) {
        if (queue.includes(floor)) return true;
      }
      return false;
    },
    closestLiftIndex(floor) {
      let liftIndex = 0, distance = floorCount;
      let minQueueIndex = 0, minQueueLength = floorCount;

      for (let shaftIndex = 0; shaftIndex < liftCount; shaftIndex++) {
        if (!this.freeLifts[shaftIndex]) {
          // Нахождениe задейственного лифта с самой короткой очередью
          if (this.queues[shaftIndex].length < minQueueLength) {
            minQueueLength = this.queues[shaftIndex].length;
            minQueueIndex = shaftIndex;
          }
        }
        else if (Math.abs(floor - this.floors[shaftIndex]) < distance) {
          // Нахождение свободного лифта
          distance = Math.abs(floor - this.floors[shaftIndex]);
          liftIndex = shaftIndex;
        }
      }
      return distance < floorCount ? liftIndex : minQueueIndex;
    },
  }
}
</script>

<style scoped>
.layout {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: row;
  padding: 10px;
  box-sizing: border-box;
}

.actionList {
  box-sizing: border-box;
  padding: 0 10px;
  border-top: 1px solid var(--black);
  border-right: 1px solid var(--black);
  border-bottom: 1px solid var(--black);
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.actionList_action {
  width: 20px;
  height: 20px;
  border: 1px solid var(--black);
  background: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 10px;
  transition: all 0.3s;
  text-align: center;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.actionList_action:hover {
  background: var(--red);
}

.active {
  background: var(--red);
}
</style>
