<template>
  <button
    type="button"
    class="close"
    :class="computedClasses"
    :disabled="disabled"
    :aria-label="computedAriaLabel"
    @click="handleClick"
    v-html="innerHtml"
  ></button>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from 'vue'
import {stopEvent} from '../../utils/event'
import {isEvent} from '../../utils/inspect'
import TextColorVariant from '../../types/TextColorVariant'
import {hasNormalizedSlot} from '@/utils/normalize-slot'

export default defineComponent({
  name: 'BButtonClose',
  props: {
    ariaLabel: {type: String, default: 'Close'},
    content: {type: String, default: '&times;'},
    disabled: {type: Boolean, default: false},
    textVariant: {type: String as PropType<TextColorVariant>, default: 'secondary'},
  },
  emits: ['click'],
  setup(props, {emit, slots}) {
    const computedAriaLabel = computed(() =>
      props.ariaLabel ? String(props.ariaLabel) : undefined
    )
    const computedClasses = computed(() => ({
      [`text-${props.textVariant}`]: props.textVariant,
    }))
    const handleClick = (event: MouseEvent) => {
      if (props.disabled && isEvent(event)) {
        stopEvent(event)
      } else {
        emit('click', event)
      }
    }

    const innerHtml = computed(() => (hasNormalizedSlot(['default'], slots) ? null : props.content))
    return {
      computedAriaLabel,
      computedClasses,
      handleClick,
      innerHtml,
    }
  },
})
</script>
