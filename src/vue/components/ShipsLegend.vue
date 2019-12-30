<template>
  <div class="flex">
    <div class="flex flex-col items-center">
      <div
        v-for="ship in ships"
        :class="{ 'flex mb-4' : size === 'normal', 'flex mb-2' : size === 'small' }"
        :key="ship.size"
      >
        <div
          v-for="index in ship.count"
          :class="{ 'flex mx-2' : size === 'normal', 'flex mx-1' : size === 'small' }"
          :key="ship.size + '-' + index"
        >
          <ship
            :size="ship.size"
            :cell-size="cellSize"
            :is-muted="index <= getNumberOfCompletedShips(ship.size)"
          >
          </ship>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import Ship from './Ship';
    export default {
        name: 'ShipsLegend',
        components: { Ship },
        props: {
            ships: {
                type: Array,
                required: true,
            },
            size: {
                type: String,
                default: 'normal',
            },
            completedShips: {
                type: Object,
                required: true,
            }
        },
        computed: {
            cellSize() {
                return this.size === 'normal' ? 30 : 25;
            },
        },
        methods: {
            getNumberOfCompletedShips(shipSize) {
                return this.completedShips[shipSize] || 0;
            },
        },
    };
</script>
