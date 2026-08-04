import { generateSuccessPatternRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出機能 - 過去商談データが1件の場合', () => {
  // SCEN-1012
  test('該当パターンに基づく推奨が生成される', async () => {
    // Arrange: モック用の過去事例データ
    const pastDealExample = {
      dealId: 'past_deal_001',
      customerIndustry: '製造業',
      productCategory: '生産管理システム',
      contractAmount: 5000000,
      contractReason: 'ROI提示が決め手',
      successIndicator: true,
    };

    // Arrange: 新規案件の入力値
    const newDealInput = {
      customerIndustry: '製造業',
      budgetMin: 4000000,
      budgetMax: 6000000,
      businessChallenge: '生産効率化',
    };

    // Arrange: AIRecommendationEngine のモック
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([pastDealExample]),
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'ROI試算シートの事前提示',
        reasoning: '過去同業種案件でROI提示が成約の決定要因だった',
      }),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // Act: 成功パターン抽出機能を実行
    const result = await generateSuccessPatternRecommendation(
      newDealInput,
      mockAIEngine
    );

    // Assert: 推奨アプローチの検証
    expect(result.recommendedApproach).toBe('ROI試算シートの事前提示');

    // Assert: 根拠説明の検証
    expect(result.reasoning).toContain('過去同業種案件');
    expect(result.reasoning).toContain('製造業');
    expect(result.reasoning).toContain('ROI提示');
    expect(result.reasoning).toContain('成約の決定要因');

    // Assert: 参照事例情報の検証
    expect(result.referencedPastDeal).toBeDefined();
    expect(result.referencedPastDeal.customerIndustry).toBe('製造業');
    expect(result.referencedPastDeal.contractAmount).toBe(5000000);
    expect(result.referencedPastDeal.contractReason).toBe('ROI提示が決め手');
    expect(result.referencedPastDeal.dealId).toBe('past_deal_001');

    // Assert: AIエンジンの呼び出し回数検証
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);

    // Assert: キャッシュまたは内部保持の確認
    expect(result.cachedRecommendationId).toBeDefined();
    expect(typeof result.cachedRecommendationId).toBe('string');
  });
});