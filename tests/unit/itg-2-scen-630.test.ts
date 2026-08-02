import { normalizePostalCode } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-630
  test('正規化ルール適用により郵便番号がハイフン統一形式に変換される', () => {
    const test_cases = [
      { input: '1234567', expected: '123-4567' },
      { input: '123-4567', expected: '123-4567' },
      { input: '123 4567', expected: '123-4567' },
      { input: '１２３−４５６７', expected: '123-4567' },
    ];

    test_cases.forEach((test_case) => {
      const result = normalizePostalCode(test_case.input);
      expect(result).toBe(test_case.expected);
    });
  });
});