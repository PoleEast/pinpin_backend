/**
 * 將單個 ID 或 ID 陣列映射為帶有 `id` 屬性的實體。
 *
 * @template T - 實體的類型，必須包含一個類型為 `number` 的 `id` 屬性。
 * @param ids - 單個 ID（number）或 ID 陣列（number[]）。也可以是 `undefined` 或 `null`。
 * @returns
 * - 如果 `ids` 是單個數字，返回一個帶有對應 `id` 的類型為 `T` 的實體。
 * - 如果 `ids` 是數字陣列，返回一個帶有對應 `id` 的類型為 `T` 的實體陣列。
 * - 如果 `ids` 是 `undefined` 或 `null`，返回 `undefined`。
 * - 如果 `ids` 包含無效數字（例如 `NaN`），這些數字會被過濾掉。
 */
export function mapIdsToEntities<T extends { id: number }>(ids?: number[]): T[] | undefined;
export function mapIdsToEntities<T extends { id: number }>(ids?: number): T | undefined;
export function mapIdsToEntities<T extends { id: number }>(ids?: number[] | number): T[] | T | undefined {
  if (ids === undefined || ids === null) return undefined;

  if (typeof ids === "number") {
    return isNaN(ids) ? undefined : ({ id: ids } as unknown as T);
  }

  return ids.filter((id): id is number => id !== null && id !== undefined && !isNaN(Number(id))).map((id) => ({ id }) as unknown as T);
}
