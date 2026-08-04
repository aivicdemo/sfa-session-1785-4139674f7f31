import { matchCustomerConditions } from '../../src/logic/it-1-br-3-3-2-1';

describe('顧客条件照合機能', () => {
  // SCEN-1132
  test('新規案件の顧客IDが入力されないとき、照合処理をスキップして業務上デフォルト値を返却する', () => {
    // Arrange: AIRecommendationEngine のスタブを構成
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 新規案件データを準備し、顧客IDフィールドを空文字列に設定
    const newDealInput = {
      customerId: '',
      dealName: 'Test Deal',
      industry: 'Manufacturing',
      companyScale: 'Large',
      budget: 5000000,
      timeline: 90,
    };

    // 統計上位パターンのマスタデータ
    const topPatterns = [
      {
        patternId: 'PAT-001',
        successRate: 0.85,
        description: 'Pattern 1',
      },
      {
        patternId: 'PAT-002',
        successRate: 0.78,
        description: 'Pattern 2',
      },
    ];

    // Act: 顧客条件照合機能に新規案件データを入力して実行
    const result = matchCustomerConditions(newDealInput, mockAIEngine);

    // Assert: AIRecommendationEngine.generateRecommendation が呼び出されていないことを確認
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();

    // 返却された値が業務上デフォルト値の構造を持つことを検証
    expect(result).toEqual({
      recommendationId: null,
      patterns: topPatterns,
      reasoning: '簡略版説明文',
    });

    // 戻り値の各フィールドが正しい型と値を持つことを確認
    expect(result.recommendationId).toBeNull();
    expect(Array.isArray(result.patterns)).toBe(true);
    expect(result.patterns.length).toBe(2);
    expect(result.patterns[0].successRate).toBe(0.85);
    expect(result.reasoning).toMatch(/簡略版/);
  });
});