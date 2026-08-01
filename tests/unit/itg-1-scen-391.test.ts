import { calculateCustomerResponsePatternMatchScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-391
  test('顧客対応パターンが成功パターンと部分的に合致している場合、合致度が0.0より大きく1.0より小さい値として数値化される', () => {
    const successPattern = ['initialContact', 'proposal', 'followUp', 'conclusion'];
    const customerResponsePattern = ['initialContact', 'proposal', 'conclusion'];

    const matchScore = calculateCustomerResponsePatternMatchScore(
      successPattern,
      customerResponsePattern
    );

    expect(typeof matchScore).toBe('number');
    expect(matchScore).toBeGreaterThan(0.0);
    expect(matchScore).toBeLessThan(1.0);
    expect(matchScore).toBeCloseTo(0.67, 2);
  });
});