import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('SCEN-1165: パターン適用可能性スコアリング機能 - 小数点四捨五入', () => {
  test('SCEN-1165: 成功パターンの評価スコア 87.456 を小数点第2位で四捨五入して 87 に整数化する', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 87.456,
        applicablePattern: true,
      }),
    };

    const dealCondition = {
      customerIndustry: 'IT',
      customerSize: 'ENTERPRISE',
      dealAmount: 5000000,
      dealStage: 'PROPOSAL',
    };

    const successPattern = {
      patternId: 'SP-20240115-001',
      industryTarget: 'IT',
      sizeTarget: 'ENTERPRISE',
      amountRange: { min: 1000000, max: 10000000 },
      stageApplicable: ['PROPOSAL', 'NEGOTIATION'],
    };

    const result = evaluatePatternRelevance(
      dealCondition,
      successPattern,
      mockAIEngine
    );

    expect(result).toEqual(
      expect.objectContaining({
        roundedScore: 87,
        originalScore: 87.456,
        isApplicable: true,
      })
    );

    expect(result.roundedScore).toBe(87);
    expect(typeof result.roundedScore).toBe('number');
  });
});