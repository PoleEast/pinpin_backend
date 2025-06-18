import { ArgumentMetadata, BadRequestException, ParseArrayOptions, ParseArrayPipe } from "@nestjs/common";

/**
 * 限制陣列長度的管道，繼承自 ParseArrayPipe
 * 驗證陣列長度是否在 minLength 和 maxLength 之間
 *
 * @param maxLength - 陣列最大長度
 * @param options - ParseArrayPipe 的選項
 * @param minLength - 陣列最小長度（預設為 0）
 *
 * @throws {BadRequestException} 當陣列長度超出範圍時拋出錯誤
 */
export class LimitedArrayPipe extends ParseArrayPipe {
  constructor(
    public readonly maxLength: number,
    public readonly options: ParseArrayOptions,
    public readonly minLength: number = 0,
  ) {
    super(options);
  }

  async transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown> {
    const result = await super.transform(value, metadata);

    if (result && Array.isArray(result)) {
      if (result.length > this.maxLength) {
        throw new BadRequestException(`陣列長度不能超過 ${this.maxLength}`);
      }
      if (result.length < this.minLength) {
        throw new BadRequestException(`陣列長度至少需要 ${this.minLength}`);
      }
    }

    return result;
  }
}
