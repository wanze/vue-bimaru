<template>
  <div class="flex">
    <div class="flex flex-col items-center">
      <div
        v-for="ship in ships"
        class="flex mb-4"
        :key="ship.size"
      >
        <div
          v-for="index in ship.count"
          class="flex mx-2"
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
            cellSize: {
                type: Number,
                required: true,
            },
            completedShips: {
                type: Object,
                required: true,
            }
        },
        methods: {
            getNumberOfCompletedShips(shipSize) {
                return this.completedShips[shipSize] || 0;
            },
        },
    };
</script>
