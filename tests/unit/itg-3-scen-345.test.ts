import { generateRecommendationWithImprovements } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-345
  test('[normal] 推奨精度検証機能 - 改善提案が生成される際、複数の改善項目が識別される場合、全項目が提案に含まれる', async () => {
    const stub_generateRecommendation = jest.fn();

    const mockRecommendationResponse = {
      recommendationId: 'REC-2026-001',
      improvementItems: [
        {
          id: 'IMP-001',
          title: '顧客ニーズヒアリング深化',
          description: '顧客の潜在ニーズをより深く掘り下げるための追加質問項目を提案',
          priority: 1,
        },
        {
          id: 'IMP-002',
          title: '提案資料の事例強化',
          description: '類似業種の成功事例を3件以上追加して説得力を強化',
          priority: 2,
        },
        {
          id: 'IMP-003',
          title: 'フォローアップタイミング最適化',
          description: '顧客の購買タイミングシグナルに基づいたフォローアップスケジュール提案',
          priority: 3,
        },
      ],
      confidenceScore: 85,
      recommendedApproach: '段階的提案アプローチ',
      reasoning: '過去の類似案件から3つの改善要因を抽出',
    };

    stub_generateRecommendation.mockResolvedValueOnce(mockRecommendationResponse);

    const input_newDealData = {
      customerName: 'テスト顧客A',
      dealValue: 5000000,
      dealStage: '提案準備段階',
      customerIndustry: '製造業',
    };

    const result = await generateRecommendationWithImprovements(
      input_newDealData,
      stub_generateRecommendation
    );

    expect(result).toBeDefined();
    expect(result.recommendationId).toBe('REC-2026-001');
    expect(result.improvementItems).toHaveLength(3);
    expect(result.improvementItems[0].title).toBe('顧客ニーズヒアリング深化');
    expect(result.improvementItems[1].title).toBe('提案資料の事例強化');
    expect(result.improvementItems[2].title).toBe('フォローアップタイミング最適化');
    expect(stub_generateRecommendation).toHaveBeenCalledWith(input_newDealData);
    expect(stub_generateRecommendation).toHaveBeenCalledTimes(1);
  });
});