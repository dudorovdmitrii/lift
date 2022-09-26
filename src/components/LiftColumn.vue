<template>
  <ul class="col">
    <li v-for="cell in cells" :key="cell.floor" class="col_cellWrapper">
      <div :class="['col_cellWrapper_cell', {'col_cellWrapper_lift': cell.hasLift}]"
        :ref="'cell' + cell.floor"></div>
    </li>
  </ul>
</template>
<script>
import store from './../store';

export default {
  data: () => {
    return {
      animationInProgress: false,
      borderWidth: 1,
    }
  },
  computed: {
    cells() {
      return store.state.cells;
    },
    queue() {
      return store.state.queue;
    },
    floor() {
      return store.state.floor;
    },
  },
  methods: {
    animate() {
      if (!this.animationInProgress) this.animationInProgress = true;

      const cellHeight = this.$refs.cell0[0].clientHeight;
      const lift = this.$refs['cell' + this.floor][0];
      const sign = this.floor > this.queue[0] ? 1 : -1;
      const distance = sign * ((cellHeight + this.borderWidth) * Math.abs(this.floor - this.queue[0]));

      const animation = lift.animate([
        { transform: `translateY(0px)` },
        { transform: `translateY(${distance}px)` }
      ], {
        duration: Math.abs(this.floor - this.queue[0]) * 1000,
        iterations: 1
      });

      const animationListener = () => {
        const newFloor = this.queue[0], prevFloor = this.floor;

        store.commit('updateFloor', { newFloor });
        store.commit('updateQueue', { action: 'shift' });
        store.commit('updateItems', { newFloor, prevFloor });

        if (this.queue.length) this.animate();
        else this.animationInProgress = false;

        animation.removeEventListener('finish', animationListener);
      }

      animation.addEventListener('finish', animationListener);
    },
  },
  mounted() {
    store.subscribe((mutation) => {
      if (mutation.type === 'updateQueue' && !this.animationInProgress) this.animate();
    })
  }
}
</script>


<style scoped>
.col {
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 100px;
  border: 1px solid var(--black);
}

.col_cellWrapper {
  flex: 1;
  border-bottom: 1px solid var(--black);
}

.col_cellWrapper:last-of-type {
  border-bottom: none;
}

.col_cellWrapper_cell,
.col_cellWrapper_lift {
  width: 100%;
  height: 100%;
}

.col_cellWrapper_lift {
  background: var(--blue);
}
</style>