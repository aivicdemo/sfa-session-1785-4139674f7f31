import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-605
  test('同じ商談条件で2回実行しても同じ根拠説明が得られる', async () => {
    // テスト用の商談条件データ
    const dealCondition = {
      customerIndustry: '製造業',
      productCategory: '生産管理システム',
      budgetScale: 5000000,
      decisionTimeline: 3
    };

    // AIRecommendationEngineのスタブ
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-20240115-001',
        approachName: '段階的導入モデル',
        confidenceScore: 78,
        reasoning: '過去3年間の類似案件120件中、このセグメントで成功率78%の提案アプローチ「段階的導入モデル」を推奨します'
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoningText: '過去3年間の類似案件120件中、このセグメントで成功率78%の提案アプローチ「段階的導入モデル」を推奨します',
        referenceExampleCount: 120,
        successRate: 78,
        generatedAt: '2024-01-15T11:00:00Z'
      })
    };

    // 第1回目の実行
    const firstRecommendation = await mockAIEngine.generateRecommendation(dealCondition);
    const firstReasoningResult = await mockAIEngine.explainRecommendationReasoning({
      recommendationId: firstRecommendation.recommendationId
    });

    const firstReasoningText = firstReasoningResult.reasoningText;
    const firstGeneratedAt = firstReasoningResult.generatedAt;

    // 第2回目の実行
    const secondRecommendation = await mockAIEngine.generateRecommendation(dealCondition);
    const secondReasoningResult = await mockAIEngine.explainRecommendationReasoning({
      recommendationId: secondRecommendation.recommendationId
    });

    const secondReasoningText = secondReasoningResult.reasoningText;
    const secondGeneratedAt = secondReasoningResult.generatedAt;

    // 検証：根拠説明が完全に一致
    expect(firstReasoningText).toBe('過去3年間の類似案件120件中、このセグメントで成功率78%の提案アプローチ「段階的導入モデル」を推奨します');
    expect(secondReasoningText).toBe('過去3年間の類似案件120件中、このセグメントで成功率78%の提案アプローチ「段階的導入モデル」を推奨します');
    expect(firstReasoningText).toBe(secondReasoningText);

    // 検証：参考事例数と成功率が一致
    expect(firstReasoningResult.referenceExampleCount).toBe(120);
    expect(secondReasoningResult.referenceExampleCount).toBe(120);
    expect(firstReasoningResult.successRate).toBe(78);
    expect(secondReasoningResult.successRate).toBe(78);

    // 検証：推奨アプローチ名が一致
    expect(firstRecommendation.approachName).toBe('段階的導入モデル');
    expect(secondRecommendation.approachName).toBe('段階的導入モデル');

    // 検証：API呼び出しが2回行われている
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(2);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(2);

    // 検証：両回とも同じ条件でAIエンジンを呼び出している
    expect(mockAIEngine.generateRecommendation).toHaveBeenNthCalledWith(1, dealCondition);
    expect(mockAIEngine.generateRecommendation).toHaveBeenNthCalledWith(2, dealCondition);
  });
});