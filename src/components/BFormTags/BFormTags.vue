<script lang="ts">
import {escapeRegExp, toString, trim} from '../../utils/stringUtils'
import {computed, defineComponent, onMounted, PropType, reactive, ref, watch} from 'vue'
import BFormTag from './BFormTag.vue'
import {RX_SPACES} from '../../constants/regex'
import {arrayIncludes, concat} from '../../utils/array'
import {isEvent, isNumber, isString} from '../../utils/inspect'
import getID from '@/utils/getID'
import {hasPropFunction} from '../../utils/props'
import {looseEqual} from '../../utils/loose-equal'

// Supported input types (for built in input)
const TYPES = ['text', 'email', 'tel', 'url', 'number']
// Default ignore input focus selector
const DEFAULT_INPUT_FOCUS_SELECTOR = ['.b-form-tag', 'button', 'input', 'select'].join(' ')

export interface TagsState {
  all: string[]
  valid: string[]
  invalid: string[]
  duplicate: string[]
}

export default defineComponent({
  name: 'BFormTags',
  components: {BFormTag},
  props: {
    inputId: {type: String, required: false},
    id: {type: String, required: false},
    modelValue: {type: Array, default: () => []},
    autofocus: {type: Boolean, default: false},
    disabled: {type: Boolean, default: false},
    form: {type: String, required: false},
    name: {type: String, required: false},
    required: {type: Boolean, default: false},
    size: {type: String, required: false},
    state: {type: Boolean, default: null},
    addButtonText: {type: String, default: 'Add'},
    addButtonVariant: {type: String, default: 'outline-secondary'},
    addOnChange: {type: Boolean, default: false},
    duplicateTagText: {type: String, default: 'Duplicate tag(s)'},
    feedbackAriaLive: {type: String, default: 'assertive'},
    ignoreInputFocusSelector: {type: [Array, String], default: () => DEFAULT_INPUT_FOCUS_SELECTOR},
    inputAttrs: {type: Object, default: () => ({})},
    inputClass: {type: [Array, Object, String], required: false},
    // inputType: {type: String, default: 'text', validator: (value) => arrayIncludes(TYPES, value)},
    inputType: {type: String, default: 'text'},
    invalidTagText: {type: String, default: 'Invalid tag(s)'},
    limit: {type: Number, required: false},
    limitTagsText: {type: String, default: 'Tag limit reached'},
    noAddOnEnter: {type: Boolean, default: false},
    noOuterFocus: {type: Boolean, default: false},
    noTagRemove: {type: Boolean, default: false},
    placeholder: {type: String, default: 'Add tag...'},
    removeOnDelete: {type: Boolean, default: false},
    separator: {type: [Array, String], required: false},
    tagClass: {type: [Array, Object, String], required: false},
    tagPills: {type: Boolean, default: false},
    tagRemoveLabel: {type: String, default: 'Remove tag'},
    tagRemovedLabel: {type: String, default: 'Tag removed'},
    tagValidator: {type: Function, required: false},
    tagVariant: {type: String, default: 'secondary'},
  },
  emits: ['update:modelValue', 'tag-state'],
  setup(props, {emit, slots}) {
    const hasFocus = ref(false)
    const newTag = ref('')
    const tags = ref<any[]>([])
    const removedTags = ref<any[]>([])

    // Escape special chars in string and replace
    // contiguous spaces with a whitespace match
    const escapeRegExpChars = (str: string) => escapeRegExp(str).replace(RX_SPACES, '\\s')
    // Remove leading/trailing spaces from array of tags and remove duplicates
    const cleanTags = (tags: any) =>
      concat(tags)
        .map((tag) => trim(toString(tag)))
        .filter((tag, index, arr) => tag.length > 0 && arr.indexOf(tag) === index)

    const splitTags = (newTag: string) => {
      // Split the input into an array of raw tags
      newTag = toString(newTag)
      const separatorRe = computedSeparatorRegExp.value
      // Split the tag(s) via the optional separator
      // Normally only a single tag is provided, but copy/paste
      // can enter multiple tags in a single operation
      return (separatorRe ? newTag.split(separatorRe) : [newTag]).map(trim).filter((p) => p)
    }

    const validateTag = (tag: string) =>
      props.tagValidator && hasPropFunction(props.tagValidator) ? props.tagValidator(tag) : true

    // Processes an input/change event, normalizing string or event argument
    const processEventValue = (event: Event) =>
      isString(event) ? event : isEvent(event) ? event.target.value || '' : ''

    // Returns a fresh empty `tagsState` object
    const cleanTagsState = (): TagsState => ({
      all: [],
      valid: [],
      invalid: [],
      duplicate: [],
    })

    const tagsState = reactive(cleanTagsState())
    const focusState = null

    const computedInputId = computed(() => props.inputId || getID('__input__'))
    const computedInputType = computed(() =>
      // We only allow certain types
      arrayIncludes(TYPES, props.inputType) ? props.inputType : 'text'
    )
    const computedInputAttrs = computed(() => ({
      // Merge in user supplied attributes
      ...props.inputAttrs,
      // Must have attributes
      id: computedInputId.value,
      value: newTag.value,
      disabled: props.disabled,
      form: props.form,
    }))

    const computedSeparator = computed(() =>
      // Merge the array into a string
      concat(props.separator)
        .filter(isString)
        .filter((p) => p)
        .join('')
    )
    const computedSeparatorRegExp = computed(() => {
      // We use a computed prop here to precompile the RegExp
      // The RegExp is a character class RE in the form of `/[abc]+/`
      // where a, b, and c are the valid separator characters
      // -> `tags = str.split(/[abc]+/).filter(t => t)`
      const separator = computedSeparator.value
      return separator ? new RegExp(`[${escapeRegExpChars(separator)}]+`) : null
    })
    const computedJoiner = computed(() => {
      // When tag(s) are invalid or duplicate, we leave them
      // in the input so that the user can see them
      // If there are more than one tag in the input, we use the
      // first separator character as the separator in the input
      // We append a space if the first separator is not a space
      const joiner = computedSeparator.value.charAt(0)
      return joiner !== ' ' ? `${joiner} ` : joiner
    })
    const computeIgnoreInputFocusSelector = computed(() =>
      // Normalize to an single selector with selectors separated by `,`
      concat(props.ignoreInputFocusSelector)
        .filter((p) => p)
        .join(',')
        .trim()
    )

    const disableAddButton = computed(() => {
      // If 'Add' button should be disabled
      // If the input contains at least one tag that can
      // be added, then the 'Add' button should be enabled
      const newTagValue = trim(newTag.value)
      return (
        newTagValue === '' ||
        !splitTags(newTagValue).some((t) => !arrayIncludes(tags.value, t) && validateTag(t))
      )
    })

    const duplicateTags = computed(() => tagsState.duplicate)
    const hasDuplicateTags = computed(() => duplicateTags.value.length > 0)
    const invalidTags = computed(() => tagsState.invalid)
    const hasInvalidTags = computed(() => invalidTags.value.length > 0)
    const isLimitReached = computed(
      () =>
        props.limit && isNumber(props.limit) && props.limit >= 0 && tags.value.length >= props.limit
    )

    watch(
      () => props.modelValue,
      (newValue) => {
        tags.value = cleanTags(newValue)
      }
    )

    watch(
      () => tags.value,
      (newValue, oldValue) => {
        // Update the `v-model` (if it differs from the value prop)
        if (!looseEqual(newValue, props.modelValue)) {
          emit('update:modelValue', newValue)
        }
        if (!looseEqual(newValue, oldValue)) {
          newValue = concat(newValue).filter((p) => p)
          oldValue = concat(oldValue).filter((p) => p)
          removedTags.value = oldValue.filter((old) => !arrayIncludes(newValue, old))
        }
      }
    )

    watch(
      () => tagsState,
      (newValue, oldValue) => {
        // Emit a tag-state event when the `tagsState` object changes
        if (!looseEqual(newValue, oldValue)) {
          emit('tag-state', newValue.valid, newValue.invalid, newValue.duplicate)
        }
      }
    )

    const parseTags = (newTag: any) => {
      // Takes `newTag` value and parses it into `validTags`,
      // `invalidTags`, and duplicate tags as an object
      // Split the input into raw tags
      const newtags = splitTags(newTag)
      // Base results
      const parsed: TagsState = {
        all: tags.value,
        valid: [],
        invalid: [],
        duplicate: [],
      }
      // Parse the unique tags
      newtags.forEach((tag) => {
        if (arrayIncludes(tags.value, tag) || arrayIncludes(parsed.valid, tag)) {
          // Unique duplicate tags
          if (!arrayIncludes(parsed.duplicate, tag)) {
            parsed.duplicate.push(tag)
          }
        } else if (validateTag(tag)) {
          // We only add unique/valid tags
          parsed.valid.push(tag)
        } else {
          // Unique invalid tags
          if (!arrayIncludes(parsed.invalid, tag)) {
            parsed.invalid.push(tag)
          }
        }
      })
      return parsed
    }

    // const addTag = (newTagValue: any) => {
    //   newTagValue = isString(newTagValue) ? newTagValue : newTag
    //   if (props.disabled || trim(newTagValue) === '' || isLimitReached.value) {
    //     // Early exit
    //     return
    //   }
    //   const parsed = parseTags(newTagValue)
    //   // Add any new tags to the `tags` array, or if the
    //   // array of `allTags` is empty, we clear the input
    //   if (parsed.valid.length > 0 || parsed.all.length === 0) {
    //     // Clear the user input element (and leave in any invalid/duplicate tag(s)
    //     /* istanbul ignore if: full testing to be added later */
    //     if (matches(this.getInput(), 'select')) {
    //       // The following is needed to properly
    //       // work with `<select>` elements
    //       newTag.value = ''
    //     } else {
    //       const invalidAndDuplicates = [...parsed.invalid, ...parsed.duplicate]
    //       newTag.value = parsed.all
    //         .filter((tag) => arrayIncludes(invalidAndDuplicates, tag))
    //         .join(computedJoiner.value)
    //         .concat(invalidAndDuplicates.length > 0 ? computedJoiner.value.charAt(0) : '')
    //     }
    //   }
    //   if (parsed.valid.length > 0) {
    //     // We add the new tags in one atomic operation
    //     // to trigger reactivity once (instead of once per tag)
    //     // We do this after we update the new tag input value
    //     // `concat()` can be faster than array spread, when both args are arrays
    //     tags.value = concat(tags.value, parsed.valid)
    //   }
    //   tagsState = reactive(parsed)
    //   // Attempt to re-focus the input (specifically for when using the Add
    //   // button, as the button disappears after successfully adding a tag
    //   this.focus()
    // }

    // onMounted(() => {
    //   // Listen for form reset events, to reset the tags input
    //   const $form = closest('form', this.$el)
    //   if ($form) {
    //     eventOn($form, 'reset', this.reset, EVENT_OPTIONS_PASSIVE)
    //   }
    // })

    // const computedInputHandlers = computed(() => ({
    //   ...omit(this.bvListeners, [EVENT_NAME_FOCUSIN, EVENT_NAME_FOCUSOUT]),
    //   blur: this.onInputBlur,
    //   change: this.onInputChange,
    //   focus: this.onInputFocus,
    //   input: this.onInputInput,
    //   keydown: this.onInputKeydown,
    //   reset: this.reset,
    // }))

    return {
      tagsState,
    }
  },
})
</script>
