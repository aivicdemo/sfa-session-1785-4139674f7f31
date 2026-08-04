import { calculateRecommendationReliabilityScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 推奨妥当性スコア算出', () => {
  // SCEN-1644
  test('[normal] AIエージェント推奨エンジン失敗時に内部パターンマスタから統計上位スコアを返す', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn()
        .mockRejectedValueOnce(new Error('API timeout'))
        .mockRejectedValueOnce(new Error('API timeout'))
        .mockRejectedValueOnce(new Error('API timeout')),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const customerData = {
      industry: 'IT',
      budget: 5000000,
      dealStage: '初期接触',
      companySize: '大企業',
    };

    const dealConditions = {
      productCategory: 'クラウドサービス',
      proposalType: '導入提案',
      timelineWeeks: 12,
    };

    const result = await calculateRecommendationReliabilityScore(
      customerData,
      dealConditions,
      mockAIEngine,
      mockFileStorage
    );

    expect(result.reliabilityScore).toBe(0.75);
    expect(result.patternId).toBe('PAT-00234');
    expect(result.reasoningExplanation).toBe(
      'マスタパターンから統計的に上位の成功パターンを適用しています。詳細分析は利用できません。'
    );
    expect(result.fallbackMode).toBe(true);

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);
  });
});