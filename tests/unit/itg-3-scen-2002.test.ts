import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2002
  test('explainRecommendationReasoningが失敗したときに内部簡略版の根拠説明にフォールバック', async () => {
    // フェイルオーバー時に使用される統計的に上位の成功パターン
    const fallbackSuccessPattern = {
      patternId: 'pattern-001',
      industry: 'IT',
      companySize: 'medium',
      successRate: 0.78,
      patternDescription: 'このパターンは過去の同業種案件で成功率が高い実績パターンです',
      keySuccessFactors: ['長期フォローアップ', '段階的提案', '経営層巻き込み'],
    };

    // AIRecommendationEngineのスタブ
    // explainRecommendationReasoningを失敗させるシナリオ
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'フェーズド導入',
        confidenceScore: 78,
        successPattern: fallbackSuccessPattern,
        reasoningExplanation: fallbackSuccessPattern.patternDescription,
        isFullExplanation: false,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockRejectedValue(
        new Error('API timeout')
      ),
      evaluatePatternRelevance: jest.fn(),
    };

    const inputCustomerData = {
      customerId: 'cust-1001',
      customerName: '山田テック',
      industry: 'IT',
      companySize: 'medium',
      annualRevenue: 50000000,
      currentChallenge: 'DX推進の加速',
    };

    const inputDealData = {
      dealId: 'deal-5001',
      dealStage: 'initial_contact',
      productCategory: 'cloud_infrastructure',
      proposedBudget: 5000000,
      decisionTimeline: 90,
    };

    // generateRecommendationを呼び出し
    // AIエンジンのexplainRecommendationReasoningが失敗したシナリオ
    const result = await generateRecommendation(
      inputCustomerData,
      inputDealData,
      mockAIEngine
    );

    // 推奨パターンマスタから統計的に上位の成功パターンが取得されたことを検証
    expect(result.successPattern.patternId).toBe('pattern-001');
    expect(result.successPattern.successRate).toBe(0.78);
    expect(result.successPattern.industry).toBe('IT');

    // フォールバック後の根拠説明が簡略版であることを検証
    expect(result.reasoningExplanation).toBe(
      'このパターンは過去の同業種案件で成功率が高い実績パターンです'
    );

    // 完全版ではなく簡略版であることを確認
    expect(result.isFullExplanation).toBe(false);

    // 推奨内容は正常に返却される
    expect(result.recommendedApproach).toBe('フェーズド導入');
    expect(result.confidenceScore).toBe(78);

    // explainRecommendationReasoningが呼び出されたことを確認
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalled();
  });
});