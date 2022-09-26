<template>
  <ul class="col">
    <li v-for="cell in cells" :key="cell.floor" class="col_cellWrapper">
      <div :class="['col_cellWrapper_cell', {'lift': cell.hasLift}]" :ref="'cell' + cell.floor">
        <div :class="['col_cellWrapper_cell_indicator', {'open': cell.hasLift && indicator}]">
          {{indicator}}
          <Arrow
            :class="['svg', {'svg_up': this.direction === 'up', 'svg_down': this.direction === 'down'}]" />
        </div>
      </div>
    </li>
  </ul>
</template>
<script>
import store from './../store';
import { startAnimation } from '@/helpers/animate';
import { blinkSettings, blinkCount } from './../settings';
import Arrow from './../icons/arrow.vue'

export default {
  data: () => {
    return {
      animationInProgress: false,
      borderWidth: 1,
      indicator: '',
      direction: 'up',
    }
  },
  components: { Arrow },
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
    async animate() {
      if (!this.animationInProgress) this.animationInProgress = true;

      const cellHeight = this.$refs.cell0[0].clientHeight;
      const sign = this.floor > this.queue[0] ? 1 : -1;
      const distance = sign * ((cellHeight + this.borderWidth) * Math.abs(this.floor - this.queue[0]));

      this.indicator = this.queue[0] + 1;
      this.direction = sign < 0 ? 'up' : 'down';

      // Запуск анимации перемещения на другой этаж
      await startAnimation(
        this.$refs['cell' + this.floor][0],
        [
          { transform: `translateY(0px)` },
          { transform: `translateY(${distance}px)` }
        ],
        {
          duration: Math.abs(this.floor - this.queue[0]) * 1000,
          iterations: 1
        }
      );

      this.indicator = ''
      const newFloor = this.queue[0], prevFloor = this.floor;
      store.commit('updateFloor', { newFloor });
      store.commit('updateItems', { newFloor, prevFloor });

      // Запуск анимации мигания
      await startAnimation(
        this.$refs['cell' + this.floor][0],
        Array.from({ length: blinkCount * 2 }, (val, ind) => ({ opacity: ind % 2 === 0 ? 1 : 0 })),
        blinkSettings
      );

      store.commit('updateQueue', { action: 'shift' });

      // Переход к следующим анимациям в очереди или завершение анимации
      if (this.queue.length) this.animate();
      else this.animationInProgress = false;
    },
  },
  mounted() {
    if (this.queue.length) this.animate();
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.col_cellWrapper_cell_indicator {
  display: none;
}

.open {
  display: block;
}

.svg {
  width: 10px;
  height: 10px;
}

.svg_up {
  transform: rotate(-90deg);
}

.svg_down {
  transform: rotate(90deg);
}

.lift {
  background: var(--blue);
}
</style>