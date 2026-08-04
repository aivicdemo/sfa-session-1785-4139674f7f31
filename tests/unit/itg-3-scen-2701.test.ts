import { jest } from '@jest/globals';
import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨ロジック外部サービス呼び出し - 再試行機能', () => {
  // SCEN-2701
  test('1回目の API 呼び出しが失敗したとき、1秒待機後に2回目の再試行が実行され、正常なレスポンスが返却される', async () => {
    jest.useFakeTimers();

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn()
        .mockRejectedValueOnce(new Error('Temporary service error'))
        .mockResolvedValueOnce({
          customerCondition: {
            industry: 'manufacturing',
            companySize: 'mid-enterprise',
            annualRevenue: 50000000,
          },
          proposalApproach: {
            strategyId: 'strat-001',
            strategyName: '段階的導入アプローチ',
            recommendedSequence: ['initial-consultation', 'pilot-implementation', 'full-rollout'],
            estimatedClosureMonths: 6,
          },
          rationale: {
            successPatternId: 'pattern-sp-2024-001',
            similarCaseCount: 12,
            successRate: 0.92,
            keyFactors: ['経営層の理解', '段階的な導入', 'ユーザー教育'],
            rootCauseAnalysis: 'Past 12 similar cases with manufacturing companies (50-100M revenue) achieved 92% success rate when using phased approach',
          },
        }),
    };

    const inputRequest = {
      customerId: 'cust-2024-0815',
      customerName: '田中工業株式会社',
      industry: 'manufacturing',
      companySize: 'mid-enterprise',
      annualRevenue: 50000000,
      dealValue: 5000000,
      dealStage: 'negotiation',
      dealDescription: '製造業向けデジタル化ツール導入',
    };

    const resultPromise = generateRecommendation(inputRequest, mockAIRecommendationEngine);

    // 1回目の呼び出しが失敗することを確認
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(1);

    // 1秒進める（再試行トリガー）
    jest.advanceTimersByTime(1000);

    const result = await resultPromise;

    // 2回目の呼び出しが実行されたことを確認
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(2);

    // 2回目のレスポンスが正常に返却されることを確認
    expect(result).toEqual({
      customerCondition: {
        industry: 'manufacturing',
        companySize: 'mid-enterprise',
        annualRevenue: 50000000,
      },
      proposalApproach: {
        strategyId: 'strat-001',
        strategyName: '段階的導入アプローチ',
        recommendedSequence: ['initial-consultation', 'pilot-implementation', 'full-rollout'],
        estimatedClosureMonths: 6,
      },
      rationale: {
        successPatternId: 'pattern-sp-2024-001',
        similarCaseCount: 12,
        successRate: 0.92,
        keyFactors: ['経営層の理解', '段階的な導入', 'ユーザー教育'],
        rootCauseAnalysis: 'Past 12 similar cases with manufacturing companies (50-100M revenue) achieved 92% success rate when using phased approach',
      },
    });

    jest.useRealTimers();
  });
});