import { generateRecommendation, explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2608
  test('推奨根拠の可視化機能 - 推奨パターンの根拠として参照される過去商談件数が1件の場合、推奨の信頼度が適切に表示される', () => {
    // Arrange: AIRecommendationEngineのスタブを設定
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 過去商談件数が1件のパターンマッチ結果を返すスタブ
    const similarPatterns = [
      {
        patternId: 'pat-001',
        customerId: 'cust-sample-001',
        industry: 'IT',
        dealStage: 'proposal',
        budgetRange: 'mid-tier',
        matchScore: 0.85,
        successIndicator: true,
      },
    ];

    mockAIEngine.findSimilarPatterns.mockResolvedValue(similarPatterns);

    // テスト用の新規案件データ
    const newDealInput = {
      customerId: 'cust-new-001',
      customerIndustry: 'IT',
      customerScale: 'mid-size',
      dealStage: 'initial-contact',
      budgetRange: 'mid-tier',
      dealAmount: 5000000,
      dealTimeline: '3-months',
    };

    // 推奨内容と根拠を生成するレスポンス
    const generatedRecommendation = {
      recommendationId: 'rec-2608-001',
      dealId: 'deal-new-001',
      recommendedApproach: 'consultative-selling',
      proposalTemplate: 'template-it-mid',
      actionTimeline: 'immediate',
      relatedPatternIds: ['pat-001'],
      confidenceScore: 0.50,
      supportingFactsCount: 1,
      riskFactors: [],
    };

    mockAIEngine.generateRecommendation.mockResolvedValue(generatedRecommendation);

    // 根拠説明文を返すスタブ設定
    const reasoningExplanation = {
      summaryText: '1件の成功事例に基づいた推奨です',
      detailText: '参照事例：1件。過去の同業種・同規模案件で成功したコンサルティング営業アプローチを推奨します。',
      referencedPastDealsCount: 1,
      confidenceLevel: 'medium-low',
      confidenceRangeStart: 0.40,
      confidenceRangeEnd: 0.60,
      visualIndicator: {
        gaugeColor: 'yellow',
        iconType: 'caution',
      },
    };

    mockAIEngine.explainRecommendationReasoning.mockResolvedValue(reasoningExplanation);

    // Act: generateRecommendationを呼び出し
    const result = generateRecommendation(
      newDealInput,
      mockAIEngine
    );

    // Assert: 推奨根拠の可視化画面の要素を検証
    expect(result).toBeDefined();
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0.40);
    expect(result.confidenceScore).toBeLessThanOrEqual(0.60);
    expect(result.supportingFactsCount).toBe(1);

    // 根拠説明文に過去商談件数1件を明示するテキストが含まれていることを確認
    const explanation = explainRecommendationReasoning(
      result.recommendationId,
      mockAIEngine
    );

    expect(explanation.summaryText).toMatch(/1件/);
    expect(explanation.detailText).toMatch(/参照事例：1件/);
    expect(explanation.referencedPastDealsCount).toBe(1);

    // 信頼度スコアが0.40～0.60の範囲内であることを確認
    expect(explanation.confidenceRangeStart).toBe(0.40);
    expect(explanation.confidenceRangeEnd).toBe(0.60);

    // 信頼度ゲージが低～中程度を示す状態で表示されていることを確認
    expect(explanation.visualIndicator.gaugeColor).toBe('yellow');
    expect(explanation.visualIndicator.iconType).toBe('caution');
  });
});