import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('顧客対応パターンと成功パターンのマッチスコア算出', () => {
  // SCEN-2182
  test('成功パターン抽出データが0件のとき、マッチスコアはnullが返される', () => {
    const customerCondition = {
      industry: '製造業',
      revenue: 5000,
      businessChallenge: 'コスト削減',
    };

    const emptyPatterns: Array<{
      patternId: string;
      successRate: number;
      customerSegment: string;
    }> = [];

    const result = evaluatePatternRelevance(customerCondition, emptyPatterns);

    expect(result).toBeNull();
  });
});