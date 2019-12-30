<template>
<div class="flex flex-col items-center">
  <div class="font-heading text-xl mb-8 text-gray-800">New Game</div>
  <ul>
    <li
      v-for="size in availableSizes"
      :key="size"
      >
      <a
        class="text-center block mb-4 bg-white px-4 py-2 text-gray-700 rounded shadow-md font-semibold text-xl hover:shadow-lg hover:text-gray-800"
        @click="$root.$emit('app.new_game', size)"
        href="#"
      >
        {{ size }} x {{ size }}
      </a>
    </li>
  </ul>
</div>
</template>

<script>
    export default {
        name: 'NewGamePanel',
        computed: {
            availableSizes() {
                return this.$store.getters.availableSizes;
            },
        },
    };
</script>

<style scoped>

</style>
