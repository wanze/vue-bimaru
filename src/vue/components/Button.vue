<template>
  <div>
    <button v-if="type === 'default'"
      class="bg-transparent text-gray-500 py-2 px-4 text-sm border-2 border-gray-500 cursor-pointer"
      @click="$emit('click', $event)"
      :disabled="disabled"
    >
      <slot></slot>
    </button>
    <button v-if="type === 'primary'"
         class="bg-blue-500 hover:bg-blue-600 text-gray-100 border-b border-blue-600 hover:border-blue-800 hover:text-white text-sm font-semibold py-2 px-4 rounded shadow-md hover:shadow-lg cursor-pointer"
         @click="$emit('click', $event)"
         :disabled="disabled"
    >
      <slot></slot>
    </button>
    <button v-if="type === 'icon'"
            class="cursor-pointer p-2 border rounded-full"
            :class="{ 'text-gray-500 border-gray-500' : disabled, 'text-gray-600 border-gray-600 hover:border-gray-800 hover:text-gray-800 shadow-lg' : !disabled }"
            @click="$emit('click', $event)"
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
    };
</script>
