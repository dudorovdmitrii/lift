<template>
  <ul class="col">
    <li v-for="cell in shaft" :key="cell.floor" class="col_cellWrapper">
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
import store from '@/store';
import { startAnimation } from '@/helpers/animate';
import { blinkSettings, blinkCount } from '@/settings';
import Arrow from '@/icons/arrow.vue'

export default {
  data: () => {
    return {
      animationInProgress: false,
      borderWidth: 1,
      indicator: '',
      direction: 'up',
    }
  },
  props: ['shaftIndex'],
  components: { Arrow },
  computed: {
    shaft() {
      return store.state.shafts[this.shaftIndex];
    },
    queue() {
      return store.state.queues[this.shaftIndex];
    },
    floor() {
      return store.state.floors[this.shaftIndex];
    },
  },
  methods: {
    async animate() {
      if (!this.animationInProgress) this.animationInProgress = true;

      const newFloor = this.queue[0], prevFloor = this.floor;
      store.commit('updateFloor', { newFloor, shaftIndex: this.shaftIndex });

      const cellHeight = this.$refs['cell' + prevFloor][0].clientHeight;
      const sign = prevFloor > newFloor ? 1 : -1;
      const distance = sign * ((cellHeight + this.borderWidth) * Math.abs(prevFloor - newFloor));

      // Установка индикатора на лифт и направления
      this.indicator = newFloor + 1;
      this.direction = sign < 0 ? 'up' : 'down';

      // Запуск анимации перемещения на другой этаж
      await startAnimation(
        this.$refs['cell' + prevFloor][0],
        [
          { transform: `translateY(0px)` },
          { transform: `translateY(${distance}px)` }
        ],
        {
          duration: Math.abs(prevFloor - newFloor) * 1000,
          iterations: 1
        }
      );

      // Снятие индикатора
      this.indicator = '';

      // Обновление ячеек с новым расположением лифта
      store.commit('updateItems', { newFloor, prevFloor, shaftIndex: this.shaftIndex });

      // Запуск анимации мигания
      await startAnimation(
        this.$refs['cell' + newFloor][0],
        Array.from({ length: blinkCount * 2 }, (val, ind) => ({ opacity: ind % 2 === 0 ? 1 : 0 })),
        blinkSettings
      );

      // Удаление достигнутого этажа из очереди
      store.commit('updateQueue', { action: 'shift', shaftIndex: this.shaftIndex });

      // Переход к следующим анимациям в очереди или завершение анимации
      if (this.queue.length) this.animate();
      else {
        store.commit('updatefreeLifts', { shaftIndex: this.shaftIndex, isLiftFree: true });
        this.animationInProgress = false;
      }
    },
  },
  mounted() {
    if (this.queue.length) this.animate();
    store.subscribe((mutation) => {
      if (mutation.type !== 'updateQueue') return;
      if (!this.queue.length) return;
      if (this.animationInProgress) return;
      this.animate();
    });
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