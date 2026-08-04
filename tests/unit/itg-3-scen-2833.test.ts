import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2833
  test('営業担当者の成約実績が0件の場合、推奨内容の信頼度スコアが適切に低下して表示される', () => {
    // 営業担当者レコード（成約実績0件）
    const salesperson = {
      id: 'sales_001',
      name: '営業担当者A',
      contractCount: 0,
    };

    // 新規案件データ
    const newOpportunity = {
      customerId: 'cust_001',
      customerName: '顧客企業X',
      industry: 'manufacturing',
      companySize: 'large',
      businessChallenge: '生産効率化',
      dealAmount: 5000000,
      estimatedClosureDate: '2024-03-31',
    };

    // AIRecommendationEngineのスタブ
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0.25,
        confidenceLevel: 'low',
      }),
      generateRecommendation: jest.fn().mockReturnValue({
        proposalApproach: '段階的な導入提案',
        recommendedActions: ['初期ヒアリング実施', '概念実証提案'],
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        reasoning:
          'この営業担当者の成約実績が限定的なため、推奨の信頼度は参考値です。過去の事例から推定した一般的なパターンに基づいています。',
        basePatterns: [],
        riskFactors: ['成約実績が限定的'],
      }),
    };

    // generateRecommendationを呼び出し
    const result = generateRecommendation(
      newOpportunity,
      salesperson,
      mockAIEngine
    );

    // 信頼度スコアが0.3以下であることを確認
    expect(result.confidenceScore).toBeLessThanOrEqual(0.3);

    // 信頼度スコアが0.25であることを確認（具体値）
    expect(result.confidenceScore).toBe(0.25);

    // 根拠説明に信頼度が参考値である旨が含まれていることを確認
    expect(result.explanation).toMatch(/成約実績が限定的/);
    expect(result.explanation).toMatch(/参考値/);

    // 推奨ランクが低いレベルで表示されることを確認
    expect(result.confidenceLevel).toBe('low');

    // AIエンジンのメソッドが正しく呼び出されたことを確認
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newOpportunity
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalled();
  });
});