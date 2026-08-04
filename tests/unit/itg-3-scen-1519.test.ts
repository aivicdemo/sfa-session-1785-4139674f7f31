import { evaluateDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('購買履歴データ品質判定機能', () => {
  test('SCEN-1519: 購買金額が小数点以下を含むとき品質判定が正常に実行される', () => {
    // 小数点以下を含む購買履歴データのテストケース
    const testCases = [
      {
        purchaseAmount: 12345.67,
        description: '標準的な小数点以下2桁',
      },
      {
        purchaseAmount: 0.99,
        description: '1円未満の小数点以下2桁',
      },
      {
        purchaseAmount: 9999999.99,
        description: '大きな金額の小数点以下2桁',
      },
      {
        purchaseAmount: 12345.678,
        description: '小数点以下3桁（過剰精度）',
      },
    ];

    testCases.forEach((testCase) => {
      const result = evaluateDataQuality({
        purchaseAmount: testCase.purchaseAmount,
        purchaseDate: '2024-01-15',
        customerId: 'CUST-001',
        productCategory: 'SERVICE',
      });

      // (1) 品質判定が正常に完了し、例外エラーが発生しない
      expect(result).toBeDefined();
      expect(result).not.toBeNull();

      // (2) 品質スコアが0〜100の数値で返される
      expect(typeof result.qualityScore).toBe('number');
      expect(result.qualityScore).toBeGreaterThanOrEqual(0);
      expect(result.qualityScore).toBeLessThanOrEqual(100);

      // (3) 判定フラグ（有効/無効）が明確に判定される
      expect(result.isValid).toBeDefined();
      expect(typeof result.isValid).toBe('boolean');

      // (4) 小数点以下の値の有無にかかわらず、金額の大小比較が一貫性を保つ
      expect(result.normalizedAmount).toBeDefined();
      expect(typeof result.normalizedAmount).toBe('number');

      // (5) 浮動小数点演算による誤差が許容範囲内（±0.01以内）に収まっている
      const expectedNormalizedAmount = Math.round(testCase.purchaseAmount * 100) / 100;
      expect(Math.abs(result.normalizedAmount - expectedNormalizedAmount)).toBeLessThanOrEqual(0.01);
    });

    // 小数点以下2桁の標準ケース検証
    const standardResult = evaluateDataQuality({
      purchaseAmount: 12345.67,
      purchaseDate: '2024-01-15',
      customerId: 'CUST-001',
      productCategory: 'SERVICE',
    });

    expect(standardResult.qualityScore).toBeGreaterThanOrEqual(80);
    expect(standardResult.isValid).toBe(true);
    expect(standardResult.normalizedAmount).toBe(12345.67);

    // 1円未満の小数ケース検証
    const smallAmountResult = evaluateDataQuality({
      purchaseAmount: 0.99,
      purchaseDate: '2024-01-15',
      customerId: 'CUST-002',
      productCategory: 'SERVICE',
    });

    expect(smallAmountResult.qualityScore).toBeGreaterThanOrEqual(70);
    expect(smallAmountResult.isValid).toBe(true);
    expect(smallAmountResult.normalizedAmount).toBe(0.99);

    // 大きな金額の小数ケース検証
    const largeAmountResult = evaluateDataQuality({
      purchaseAmount: 9999999.99,
      purchaseDate: '2024-01-15',
      customerId: 'CUST-003',
      productCategory: 'SERVICE',
    });

    expect(largeAmountResult.qualityScore).toBeGreaterThanOrEqual(80);
    expect(largeAmountResult.isValid).toBe(true);
    expect(largeAmountResult.normalizedAmount).toBe(9999999.99);

    // 過剰精度（小数点以下3桁）のケース検証
    const excessivePrecisionResult = evaluateDataQuality({
      purchaseAmount: 12345.678,
      purchaseDate: '2024-01-15',
      customerId: 'CUST-004',
      productCategory: 'SERVICE',
    });

    expect(excessivePrecisionResult.qualityScore).toBeDefined();
    expect(excessivePrecisionResult.isValid).toBeDefined();
    // 丸め後の値が12345.68に正規化される
    expect(Math.abs(excessivePrecisionResult.normalizedAmount - 12345.68)).toBeLessThanOrEqual(0.01);
  });
});