import { generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-1942: 推奨内容の根拠表示機能 - 根拠の有効期限が昨日のときに根拠が表示対象から除外される', () => {
    const today = new Date('2026-08-01');
    const yesterday = new Date('2026-07-31');
    const tomorrow = new Date('2026-08-02');

    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendedApproach: 'カスタマイズされた提案アプローチ',
        confidenceScore: 85,
        reasoning: [
          {
            id: 'reason_1',
            content: '過去の類似案件での成功実績',
            validUntil: today.toISOString(),
            sourcePattern: 'pattern_001'
          },
          {
            id: 'reason_2',
            content: '顧客業種別の標準提案パターン',
            validUntil: yesterday.toISOString(),
            sourcePattern: 'pattern_002'
          },
          {
            id: 'reason_3',
            content: '最新の市場動向に基づく推奨',
            validUntil: tomorrow.toISOString(),
            sourcePattern: 'pattern_003'
          }
        ]
      })
    };

    const customerCondition = {
      customerId: 'CUST_20260801_001',
      industry: 'テクノロジー',
      companySize: '中堅企業',
      revenue: 50000000
    };

    const dealCondition = {
      dealId: 'DEAL_20260801_001',
      dealStage: '提案準備',
      estimatedValue: 2500000,
      timelineMonths: 3
    };

    const result = generateRecommendation(
      customerCondition,
      dealCondition,
      mockRecommendationEngine
    );

    expect(result.recommendedApproach).toBe('カスタマイズされた提案アプローチ');
    expect(result.confidenceScore).toBe(85);

    const validReasonings = result.reasoning.filter(
      (reason: { validUntil: string }) =>
        new Date(reason.validUntil) >= today
    );

    expect(validReasonings).toHaveLength(2);
    expect(validReasonings.map((r: { id: string }) => r.id)).toEqual([
      'reason_1',
      'reason_3'
    ]);
    expect(validReasonings.map((r: { id: string }) => r.id)).not.toContain(
      'reason_2'
    );
  });
});