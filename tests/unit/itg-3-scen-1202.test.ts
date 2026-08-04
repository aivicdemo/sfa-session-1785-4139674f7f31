import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1202
  test('[normal] 提案妥当性判定機能 - 妥当性判定の根拠が営業管理職向けに自然言語で説明される', async () => {
    const stubAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: 'カスタマイズ製造ソリューション導入',
        confidenceScore: 82,
        successPatternId: 'SP-MFG-PROD-001',
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        '過去3年間の同業種案件で成功率が82%のアプローチです。顧客の課題である生産効率化に対して、製造業界での成功パターンが適用可能です。同規模予算（5000万円帯）での導入実績が15件あり、平均ROI 1.4倍を達成しています。このアプローチにより、生産ラインの稼働率向上と廃棄率削減を同時に実現した事例が多数あります。'
      ),
    };

    const newCaseInfo = {
      customerIndustry: '製造業',
      customerChallenge: '生産効率化',
      budgetSize: 50000000,
      customerScale: '従業員1000名以上',
    };

    const recommendationResult = await stubAIEngine.generateRecommendation(newCaseInfo);

    expect(recommendationResult.proposalApproach).toBe('カスタマイズ製造ソリューション導入');
    expect(recommendationResult.confidenceScore).toBe(82);
    expect(recommendationResult.successPatternId).toBe('SP-MFG-PROD-001');
    expect(stubAIEngine.generateRecommendation).toHaveBeenCalledWith(newCaseInfo);

    const reasoningExplanation = await explainRecommendationReasoning(
      recommendationResult,
      newCaseInfo,
      stubAIEngine
    );

    expect(stubAIEngine.explainRecommendationReasoning).toHaveBeenCalled();

    expect(reasoningExplanation).toContain('過去3年間');
    expect(reasoningExplanation).toContain('成功率が82%');
    expect(reasoningExplanation).toContain('生産効率化');
    expect(reasoningExplanation).toContain('製造業界');
    expect(reasoningExplanation).toContain('5000万円');
    expect(reasoningExplanation).toContain('ROI');

    const paragraphs = reasoningExplanation.split('。');
    expect(paragraphs.length).toBeGreaterThanOrEqual(3);

    expect(reasoningExplanation).toMatch(/[ぁ-ん]/);
    expect(reasoningExplanation).toMatch(/[ァ-ヴー]/);
  });
});