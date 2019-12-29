<template>
  <div>
    <button
      @click="$emit('click', $event)"
      :class="classes"
      :disabled="disabled"
    >
      <slot></slot>
    </button>
  </div>
</template>

<script>
    export default {
        name: 'Button',
        props: {
            type: {
                type: String,
                default: 'default',
            },
            disabled: {
                type: Boolean,
                default: false,
            },
        },
        computed: {
            classes() {
              const classes = {
                  'default': 'button -default bg-white p-2 text-sm text-gray-500 cursor-pointer rounded-full shadow-md',
                  'primary': 'button -primary text-sm bg-blue-400 text-white font-bold py-2 px-4 rounded-lg',
                  'icon': {
                      'button -icon button -default bg-white p-2 text-sm text-gray-500 cursor-pointer rounded-full shadow-md opacity-50 cursor-not-allowed': this.disabled,
                      'button -icon button -default bg-white p-2 text-sm text-gray-500 cursor-pointer rounded-full shadow-md hover:shadow-lg hover:text-gray-700': !this.disabled,
                  },
              };

              return classes[this.type];
            },
        },
    };
</script>

<style lang="scss">
  /*.button {*/
  /*  box-shadow: 0 3px darken(#4299e1, 10%);*/

  /*  &:hover {*/
  /*    box-shadow: 0 2px darken(#4299e1, 10%);*/
  /*  }*/
  /*}*/
</style>
