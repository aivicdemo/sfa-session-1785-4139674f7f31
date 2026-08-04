import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('パターンマッチング評価機能 - 成功パターン適用可能性スコア評価', () => {
  // SCEN-1129
  test('適用可能性スコアが100点のとき成功パターンを推奨として採用する', () => {
    // Arrange
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 100,
        applicabilityStatus: 'APPLICABLE',
        reasoning: '顧客規模・商品・予算条件が新規案件と完全に合致',
      }),
    };

    const successPattern = {
      patternId: 'PAT-2024-001',
      customerSize: '中堅企業',
      product: 'クラウドERPソリューション',
      contractAmount: 5000,
      approachStrategy: '段階的な導入フェーズ提案',
      successFactors: [
        '顧客のデジタル化推進計画との整合',
        'CFOレベルとの関係構築',
        '既存システムとの統合計画の事前提示',
      ],
    };

    const newOpportunity = {
      customerSize: '中堅企業',
      product: 'クラウドERPソリューション',
      budgetMin: 4500,
      budgetMax: 5500,
      salesStage: '初回ヒアリング',
    };

    // Act
    const recommendation = evaluatePatternRelevance(
      successPattern,
      newOpportunity,
      mockAIRecommendationEngine
    );

    // Assert
    expect(recommendation.recommendationStatus).toBe('ADOPTED');
    expect(recommendation.relevanceScore).toBe(100);
    expect(recommendation.adoptedPatternId).toBe('PAT-2024-001');
    expect(recommendation.proposedApproach).toBe('段階的な導入フェーズ提案');
    expect(recommendation.reasoning).toContain('顧客規模・商品・予算条件が新規案件と完全に合致');
    expect(recommendation.reasoning).toContain('適用理由「顧客規模・商品・予算条件が新規案件と合致」');
    expect(recommendation.successFactorsApplied).toEqual([
      '顧客のデジタル化推進計画との整合',
      'CFOレベルとの関係構築',
      '既存システムとの統合計画の事前提示',
    ]);
    expect(recommendation.displayableContent).toBeDefined();
    expect(recommendation.displayableContent.patternDetails).toContain('PAT-2024-001');
    expect(recommendation.displayableContent.salesGuidance).toBeDefined();
  });
});