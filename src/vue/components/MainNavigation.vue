<template>
  <div>
    <div
      class="fixed z-30 top-0 left-0 w-full h-full flex items-center justify-center bg-black opacity-25"
    ></div>
    <div
      class="fixed top-0 left-0 w-full md:w-1/3 lg:max-w-sm bg-gray-800 h-screen z-40 shadow-2xl p-4 text-white"
      @keyup.esc="emitClose()"
    >
      <button
        class="absolute right-0 top-0 mt-5 mr-5 text-gray-300 hover:text-white focus:text-white"
        @click="emitClose()"
        data-close
      >
        <svg class="fill-current w-5 h-5" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <g stroke="none" stroke-width="1" fill-rule="evenodd">
            <g id="icon-shape">
              <polygon id="Combined-Shape"
                       points="10 8.58578644 2.92893219 1.51471863 1.51471863 2.92893219 8.58578644 10 1.51471863 17.0710678 2.92893219 18.4852814 10 11.4142136 17.0710678 18.4852814 18.4852814 17.0710678 11.4142136 10 18.4852814 2.92893219 17.0710678 1.51471863 10 8.58578644"></polygon>
            </g>
          </g>
        </svg>
      </button>

      <div class="flex flex-col items-center justify-center h-full md:justify-start md:items-start md:ml-4 md:mt-16">
        <a
          @click="newGame()"
          class="mb-4 block text-xl font-semibold uppercase text-gray-500 hover:text-white focus:text-white"
          href="#"
        >New Game
        </a>
        <a
          v-show="canReset"
          @click="reset()"
          class="block text-xl font-semibold uppercase text-gray-500 hover:text-white focus:text-white"
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
        mounted() {
            const $closeButton = this.$el.querySelector('[data-close]');
            $closeButton.focus();
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
            },
        },
    };
</script>

<style scoped>

</style>
