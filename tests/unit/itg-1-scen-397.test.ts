import { analyzeCustomerResponsePatternMatch } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-397
  test('顧客対応パターンレコードが1件の場合、該当の1件に対して合致度が計算される', () => {
    const customerResponsePattern = {
      patternId: 'PAT-001',
      initialContactDateTime: new Date('2024-01-15T10:00:00Z'),
      responseMethod: 'phone',
      responseTimeMinutes: 30,
      proposalContent: 'product_a_premium',
    };

    const contractResult = {
      contractDateTime: new Date('2024-01-22T14:30:00Z'),
      contractAmount: 250000,
      contractProduct: 'product_a_premium',
    };

    const matchDegree = analyzeCustomerResponsePatternMatch(
      customerResponsePattern,
      contractResult
    );

    expect(typeof matchDegree).toBe('number');
    expect(matchDegree).toBeGreaterThanOrEqual(0);
    expect(matchDegree).toBeLessThanOrEqual(100);
    expect(matchDegree).toBe(85.5);
  });
});