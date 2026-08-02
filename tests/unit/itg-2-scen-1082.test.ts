import { describe, test, expect } from '@jest/globals';
import { detectAndMergeCustomerDuplicates } from '../../src/logic/it-1-br-2-2-1-1';

// SCEN-1082
describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('比較対象の顧客属性が未指定のとき、エラーが発生する', () => {
    const input = {
      compareAttributes: {}
    };

    expect(() => {
      detectAndMergeCustomerDuplicates(input);
    }).toThrow(/ATTR_NOT_SPECIFIED/);

    try {
      detectAndMergeCustomerDuplicates(input);
    } catch (error: unknown) {
      if (error instanceof Error && 'statusCode' in error) {
        expect((error as { statusCode: number }).statusCode).toBe(400);
      }
      expect((error as Error).message).toMatch(/比較対象の顧客属性が指定されていません/);
    }
  });
});