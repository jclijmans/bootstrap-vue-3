<template>
  <b-badge
    :id="tagId"
    class="b-form-tag d-inline align-items-baseline mw-100"
    :tag="tag"
    :variant="variant"
    :pill="pill"
    :title="title"
    :aria-labeledby="tagLabelId"
  >
    <span class="b-form-tag-content flex-grow-1 text-truncate">
      {{ tagContent }}
    </span>
    <b-button-close
      v-if="showRemove"
      class="b-form-tag-remove"
      :aria-label="removeLabel"
      :aria-controls="tagId"
      :aria-describedby="tagLabelId"
      aria-keyshortcuts="Delete"
      @click="onRemove"
      @keydown="onRemove"
    ></b-button-close>
  </b-badge>
</template>

<script lang="ts">
import TextColorVariant from '../../types/TextColorVariant'
import {computed, defineComponent, PropType} from 'vue'
import getID from '../../utils/getID'
import {normalizeSlot} from '../../utils/normalize-slot'
import BButtonClose from '../BButton/BButtonClose.vue'

export const CODE_DELETE = 46
export const EVENT_NAME_REMOVE = 'remove'

export default defineComponent({
  name: 'BFormTag',
  components: {BButtonClose},
  props: {
    id: {type: String, required: false},
    disabled: {type: Boolean, default: false},
    noRemove: {type: Boolean, default: false},
    pill: {type: Boolean, default: false},
    removeLabel: {type: String, default: 'Remove tag'},
    tag: {type: String, default: 'span'},
    title: {type: String, required: false},
    variant: {type: String as PropType<TextColorVariant>, default: 'secondary'},
  },
  emits: [EVENT_NAME_REMOVE, 'update:pressed'],
  setup(props, {emit, slots}) {
    const showRemove = computed(() => !props.noRemove && !props.disabled)
    const tagId = computed(() => getID())
    const tagLabelId = computed(() => getID('_taglabel_'))
    const tagContent = computed(() => normalizeSlot('default', {}, slots) || props.title)

    const onRemove = (event: KeyboardEvent) => {
      console.log('onRemove', event)
      if (
        (!props.disabled && event.type === 'click') ||
        (event.type === 'keydown' && event.keyCode === CODE_DELETE)
      ) {
        console.log('emitted', EVENT_NAME_REMOVE)
        emit(EVENT_NAME_REMOVE)
      }
    }
    return {
      onRemove,
      showRemove,
      tagContent,
      tagId,
      tagLabelId,
    }
  },
})
</script>
