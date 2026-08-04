import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1054
  test('[normal] 推奨根拠に過去の成功パターン詳細情報が含まれる', async () => {
    const newDealData = {
      customerIndustry: '製造業',
      budgetAmount: 50000000,
      issue: '生産効率化',
    };

    const successPatternDetail = {
      patternId: 'SP-2024-001',
      successCaseName: '大型製造業の生産ラインデジタル化',
      pastCustomerIndustry: '製造業',
      contractAmount: 48000000,
      dealDurationDays: 45,
      adoptedApproachContent: 'AI導入による生産ラインの自動化と監視システム構築',
      successFactorExplanation: '既存システムとの統合を重視し、段階的な導入で運用リスクを最小化。顧客のIT人材不足に対応するため、導入後の運用支援を充実させたことが成功要因。',
    };

    const stubAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-2024-001',
        recommendedApproach: '段階的AI導入による生産効率化',
        confidenceScore: 92,
        reasoningBasis: {
          similarPatterns: [successPatternDetail],
          pastSuccessMetrics: {
            adoptionRate: 0.95,
            roi: 2.8,
          },
        },
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        '本案件は2024年に実施した大型製造業のデジタル化プロジェクトと業種・予算規模が類似しています。' +
          '当時採用した段階的AI導入アプローチにより、導入3ヶ月で生産効率が28%向上し、' +
          '投資対効果（ROI）が2.8倍に達しました。運用支援の充実が特に効果的でした。'
      ),
    };

    const result = await generateRecommendation(newDealData, stubAIEngine);

    expect(result).toBeDefined();
    expect(result.reasoningBasis).toBeDefined();
    expect(result.reasoningBasis.similarPatterns).toHaveLength(1);

    const displayedPattern = result.reasoningBasis.similarPatterns[0];
    expect(displayedPattern.patternId).toBe('SP-2024-001');
    expect(displayedPattern.successCaseName).toBe('大型製造業の生産ラインデジタル化');
    expect(displayedPattern.pastCustomerIndustry).toBe('製造業');
    expect(displayedPattern.contractAmount).toBe(48000000);
    expect(displayedPattern.dealDurationDays).toBe(45);
    expect(displayedPattern.adoptedApproachContent).toBe('AI導入による生産ラインの自動化と監視システム構築');
    expect(displayedPattern.successFactorExplanation).toBe(
      '既存システムとの統合を重視し、段階的な導入で運用リスクを最小化。顧客のIT人材不足に対応するため、導入後の運用支援を充実させたことが成功要因。'
    );

    const reasoningExplanation = await stubAIEngine.explainRecommendationReasoning(result.recommendationId);
    expect(reasoningExplanation).toContain('2024年に実施した大型製造業のデジタル化プロジェクト');
    expect(reasoningExplanation).toContain('段階的AI導入アプローチ');
    expect(reasoningExplanation).toContain('生産効率が28%向上');
    expect(reasoningExplanation).toContain('投資対効果（ROI）が2.8倍');
    expect(reasoningExplanation).toContain('運用支援の充実が特に効果的');

    expect(result.confidenceScore).toBe(92);
    expect(result.reasoningBasis.pastSuccessMetrics.adoptionRate).toBe(0.95);
    expect(result.reasoningBasis.pastSuccessMetrics.roi).toBe(2.8);
  });
});