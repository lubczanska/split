export function assertDefined<T>(val: T) {
  if (!val) throw Error("Undefined value");
}
