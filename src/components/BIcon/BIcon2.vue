<script lang="ts">
import {computed, defineComponent, h, PropType} from 'vue'
import {Animation, ColorVariant, IconSize} from '../../types'
import BIconBase from './BIconBase.vue'

export default /* #__PURE__ */ defineComponent({
  name: 'BIcon2',
  components: {BIconBase},
  props: {
    animation: {type: String as PropType<Animation>},
    flipH: {type: Boolean, default: false},
    flipV: {type: Boolean, default: false},
    fontScale: {type: [Number, String], default: 1},
    icon: {type: Object, required: true},
    rotate: {
      type: [String, Number],
      required: false,
      validator: (value: string | number) => value >= -360 && value <= 360,
    },
    scale: {type: [Number, String], default: 1},
    shiftH: {type: [Number, String], default: 0},
    shiftV: {type: [Number, String], default: 0},
    size: {type: String as PropType<IconSize>, required: false},
    stacked: {type: Boolean, default: false},
    title: {type: String, required: false},
    variant: {type: String as PropType<ColorVariant>, required: false},
  },
  setup(props) {
    return {}
  },
  render() {
    console.log('icon', this.$props.icon.render().props)

    const icon = this.$props.icon.render()
    if (icon?.props?.width) icon.props.width = undefined
    if (icon?.props?.height) icon.props.height = undefined
    return h(
      BIconBase,
      {
        ...this.$props,
        content: icon,
      },
      {
        default: () => '',
      }
    )
  },
})
</script>
