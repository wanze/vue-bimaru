<template>
  <div
    class="cell"
    :class="classes"
    :style="cellStyle"
  >
    <slot></slot>
  </div>
</template>

<script>
    export default {
        name: 'Cell',
        props: {
            size: {
                type: Number,
                required: true,
            },
            type: {
                type: String,
                default: 'empty',
            },
            x: {
                type: Number,
                default: 0,
            },
            y: {
                type: Number,
                default: 0,
            },
            isMuted: {
                type: Boolean,
                default: false,
            },
        },
        computed: {
            cellStyle() {
                return `width: ${this.size}px; height: ${this.size}px; line-height: ${this.size}px;`;
            },
            classes() {
                const classes = ['-' + this.type];

                if (this.isMuted) {
                    classes.push('-muted');
                }

                if (this.type === 'water' && this.y % 2 === 0) {
                    classes.push('-reverse');
                }

                return classes;
            }
        }
    };
</script>

<style lang="scss">
  $ship-color: #718096;
  $water-color1: #BEE3F8;
  $water-color2: #63B3ED;
  //$water-color1: #0ed2f7;
  //$water-color2: #b2fefa;

  .cell {
    display: block;
    position: relative;

    &.-water {
      // Source: https://uigradients.com/#Telegram
      background: $water-color1;
      background: linear-gradient(to right, $water-color1, $water-color2);
      box-shadow: inset 0 0 1px 1px #ffffff;

      &.-reverse {
        background: linear-gradient(to left, $water-color1, $water-color2);
      }

      &.-muted {
        opacity: 0.5;
      }
    }

    &.-ship {
      background: $ship-color;
      box-shadow: inset 0 0 0 1px #ffffff;
    }

    &.-ship_left,
    &.-ship_right,
    &.-ship_top,
    &.-ship_bottom,
    &.-ship_single {
      &::before {
        margin: 1px 0 0 1px;
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        content: "";
        position: absolute;
        background: $ship-color;
        top: 0;
        left: 0;
        border-bottom-left-radius: 100%;
        border-top-left-radius: 100%;
      }
    }

    &.-ship_right::before {
      transform: rotate(180deg);
    }

    &.-ship_top::before {
      transform: rotate(90deg);
    }

    &.-ship_bottom::before {
      transform: rotate(270deg);
    }

    &.-ship_single::before {
      border-top-right-radius: 100%;
      border-bottom-right-radius: 100%;
    }

    &.-muted {
      opacity: 0.6;
    }
  }
</style>
