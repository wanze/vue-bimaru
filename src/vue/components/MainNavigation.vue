<template>
  <div>
    <div
      class="fixed z-30 top-0 left-0 w-full h-full flex items-center justify-center bg-black opacity-25"
    ></div>
    <div
      class="fixed top-0 left-0 w-full md:w-1/3 lg:max-w-sm bg-gray-800 h-screen z-40 shadow-2xl p-4 text-white"
      @keyup.esc="emitClose()"
    >
      <div class="flex flex-col items-center mt-4">
        <a
          @click="newGame()"
          class="mb-4 block text-xl font-semibold uppercase text-gray-400 hover:text-white"
          href="#"
        >New Game
        </a>
        <a
          v-show="canReset"
          @click="reset()"
          class="block text-xl font-semibold uppercase text-gray-500 hover:text-white"
          href="#"
        >Reset current Game
        </a>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'MainNavigation',
        computed: {
            canReset() {
                return this.$store.getters['activeGame/canReset'];
            },
        },
        methods: {
            newGame() {
                this.$root.$emit('app.toggle_panel', 'newGame');
                this.emitClose();
            },
            reset() {
                const answer = window.confirm('Do you really want to start the current puzzle again?');
                if (answer) {
                    this.$store.dispatch('activeGame/reset');
                    this.emitClose();
                }
            },
            emitClose() {
                this.$emit('close');
            }
        }
    };
</script>

<style scoped>

</style>
