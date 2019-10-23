<template>
  <div>
    <div
      class="modal-backdrop fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center"
    >
      <div
        role="dialog"
        data-modal-dialog
        class="bg-white p-10 min-w-full md:min-w-1/2"
        tabindex="0"
        @keyup.esc="$emit('close')"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'Modal',
        data() {
            return {
                focusedElement: null,
            };
        },
        created() {
            this.$nextTick(function() {
                this.$el.querySelector('[data-modal-dialog]').focus();
                this.focusedElement = document.activeElement;
            });
        },
        beforeDestroy() {
            if (this.focusedElement) {
                this.$nextTick(function() {
                    this.focusedElement.focus();
                });
            }
        }
    };
</script>

<style lang="scss">
  .modal-backdrop {
    background-color: rgba(0, 0, 0, .5);
    transition: opacity .3s ease;
  }
</style>
