import { generateRecommendationWithHistory } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2359
  test('推奨履歴記録機能 - 推奨履歴に0件のデータが格納されているとき新規記録が追加できる', async () => {
    const now = new Date('2024-01-15T11:00:00Z');
    const timestampMs = now.getTime();

    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-TEST-001',
        proposalApproach: '顧客の予算制約を重視した段階的導入提案',
        confidenceScore: 0.85,
      }),
    };

    const mockDatabase = {
      queryRecommendationHistory: jest.fn().mockResolvedValue([]),
      insertRecommendationHistory: jest.fn().mockResolvedValue({
        recommendationId: 'REC-TEST-001',
        customerId: 'CUST-2359',
        dealId: 'DEAL-2359',
        proposalApproach: '顧客の予算制約を重視した段階的導入提案',
        confidenceScore: 0.85,
        recordedAt: new Date(timestampMs),
      }),
    };

    const input = {
      customerId: 'CUST-2359',
      dealId: 'DEAL-2359',
      dealCondition: {
        industry: '製造業',
        budget: '500万円以下',
      },
    };

    const result = await generateRecommendationWithHistory(
      input,
      mockRecommendationEngine,
      mockDatabase,
      now,
    );

    expect(result.recordCount).toBe(1);
    expect(result.recommendation.recommendationId).toBe('REC-TEST-001');
    expect(result.recommendation.customerId).toBe('CUST-2359');
    expect(result.recommendation.dealId).toBe('DEAL-2359');
    expect(result.recommendation.proposalApproach).toBe(
      '顧客の予算制約を重視した段階的導入提案',
    );
    expect(result.recommendation.confidenceScore).toBe(0.85);
    expect(result.recommendation.recordedAt.getTime()).toBeGreaterThanOrEqual(
      timestampMs - 5000,
    );
    expect(result.recommendation.recordedAt.getTime()).toBeLessThanOrEqual(
      timestampMs + 5000,
    );
  });
});