import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンテンプレート自動判定機能', () => {
  test('SCEN-2599: 適合度スコアが0点である場合の判定結果が正確に計算される', async () => {
    // Arrange
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: 0,
        relevantPatterns: [],
        calculationLog: 'スコア0のため当該パターンは非適用',
      }),
    };

    const sampleDealConditions = {
      customerIndustry: 'IT',
      budgetScale: 5000000,
      dealStage: 'negotiation',
      dealSize: 'large',
      customerSize: 'enterprise',
    };

    const successPatternTemplate = {
      id: 'pattern_001',
      name: 'エンタープライズ向け大型案件パターン',
      customerAttributes: {
        industry: ['IT', 'Finance', 'Manufacturing'],
        size: ['enterprise', 'large_mid_market'],
        budgetRange: { min: 3000000, max: 50000000 },
      },
      dealCharacteristics: {
        stage: ['discovery', 'negotiation', 'contract'],
        minDealSize: 3000000,
        proposalType: 'custom_solution',
      },
      successIndicators: {
        minWinRate: 0.65,
        avgClosingCycle: 120,
      },
    };

    // Act
    const result = await evaluatePatternRelevance(
      sampleDealConditions,
      successPatternTemplate,
      mockAIRecommendationEngine
    );

    // Assert
    expect(result.score).toBe(0);
    expect(result.isRelevant).toBe(false);
    expect(result.calculationLog).toContain('スコア0のため当該パターンは非適用');
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      sampleDealConditions,
      successPatternTemplate
    );
    expect(result.error).toBeUndefined();
  });
});