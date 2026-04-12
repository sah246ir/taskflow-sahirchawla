/**
 * Removes all keys from an object whose value is null or undefined.
 * Deeply cleans nested objects and arrays.
 *
 * @param obj The object to clean.
 * @returns A new object with null and undefined values removed.
 */
export function cleanObject<T>(obj: T): T {
  if (Array.isArray(obj)) {
    // If it's an array, clean each entry
    return obj
      .map((v) => cleanObject(v))
      .filter((v) => v !== null && v !== undefined) as T
  }

  if (typeof obj !== "object" || obj === null) {
    // Return all non-object or null values as-is
    return obj
  }

  const result: any = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      if (typeof value === "object") {
        const cleaned = cleanObject(value)
        if (
          !(typeof cleaned === "object" && cleaned !== null && Object.keys(cleaned).length === 0 && !Array.isArray(cleaned))
        ) {
          result[key] = cleaned
        }
      } else {
        result[key] = value
      }
    }
  }
  return result
}