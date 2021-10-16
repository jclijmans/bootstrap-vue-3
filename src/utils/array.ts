// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const arrayIncludes = (array: any[], value: any) => array.indexOf(value) !== -1
export const concat = (...args) => Array.prototype.concat.apply([], args)
export const from = (...args): any[] => Array.from(...args)
