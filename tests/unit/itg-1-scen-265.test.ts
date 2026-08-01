import { evaluateSuccessPatternApproach } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-265
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 成功パターンの成功率が完全に満たされている場合、高信頼度のアプローチとして特定される', () => {
    const successPatternMatrix = [
      {
        patternId: 'P001',
        industry: '製造業',
        proposalMethod: '対面営業',
        successRate: 100,
        confidenceThreshold: 80,
      },
    ];

    const input = {
      industry: '製造業',
      proposalMethod: '対面営業',
      successPatternMatrix: successPatternMatrix,
    };

    const result = evaluateSuccessPatternApproach(input);

    expect(result.approachConfidence).toBe('高信頼度');
    expect(result.recommendedPatternId).toBe('P001');
    expect(result.actualSuccessRate).toBe(100);
    expect(result.confidenceScore).toBe(100);
    expect(result.isApplicable).toBe(true);
  });
});