import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - マッチスコア算出', () => {
  test('SCEN-2183: 成功パターン1件のみの場合、顧客対応パターンとの照合スコアを正確に算出', () => {
    const successPatterns = [
      {
        patternId: 'SP-001',
        description: '大規模案件向け段階的提案',
        matchScore: null,
      },
    ];

    const customerPatternData = {
      customerId: 'CUST-123',
      dealValue: 5000000,
      industryType: 'manufacturing',
      decisionMakerCount: 3,
    };

    const result = evaluatePatternRelevance(
      customerPatternData,
      successPatterns
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('patternId');
    expect(result.patternId).toBe('SP-001');
    expect(result).toHaveProperty('matchScore');
    expect(typeof result.matchScore).toBe('number');
    expect(result.matchScore).toBeGreaterThanOrEqual(0);
    expect(result.matchScore).toBeLessThanOrEqual(100);
  });
});