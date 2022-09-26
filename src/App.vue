<template>
  <main class="layout">
    <lift-column></lift-column>
    <div class="actionList">
      <button v-for="(val, i) in cells.length" :key="i" @click="addFloor(cells.length - i - 1)"
        :class="['actionList_action', {'active': queue.findIndex(floor => floor === cells.length - i - 1) !== -1}]">
        {{cells.length - i}}
      </button>
    </div>
  </main>
</template>

<script>
import store from './store';
import LiftColumn from './components/LiftColumn.vue';

export default {
  name: 'App',
  computed: {
    cells() {
      return store.state.cells;
    },
    queue() {
      return store.state.queue;
    }
  },
  components: { LiftColumn },
  methods: {
    addFloor(floor) {
      if (this.queue.includes(floor)) return;
      store.commit('updateQueue', { action: 'push', floor: floor });
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
