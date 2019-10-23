<template>
  <div
    v-if="size === 1"
    class="flex"
  >
    <cell
      type="ship_single"
      :size="cellSize"
      :is-muted="isMuted"
    >
    </cell>
  </div>
  <div
    v-else
    class="flex"
  >
    <cell
      v-for="index in size"
      :key="index"
      :size="cellSize"
      :type="getCellType(index, size)"
      :is-muted="isMuted"
    >
    </cell>
  </div>
</template>

<script>
    import Cell from './Cell';

    export default {
        name: 'Ship',
        components: { Cell },
        props: {
            size: {
                type: Number,
                required: true,
            },
            cellSize: {
                type: Number,
                required: true,
            },
            isMuted: {
                type: Boolean,
                default: false,
            }
        },
        methods: {
            getCellType(index, size) {
                if (index === 1) {
                    return 'ship_left';
                } else if (index === size) {
                    return 'ship_right';
                }

                return 'ship';
            },
        },
    };
</script>
