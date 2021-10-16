// Utility method to prevent the default event handling and propagation
export const stopEvent = (
  event: Event,
  {preventDefault = true, propagation = true, immediatePropagation = false} = {}
): void => {
  if (preventDefault) {
    event.preventDefault()
  }
  if (propagation) {
    event.stopPropagation()
  }
  if (immediatePropagation) {
    event.stopImmediatePropagation()
  }
}
