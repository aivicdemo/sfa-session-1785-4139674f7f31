import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1806
  test('推奨タイミングの根拠が自然言語で説明文として生成される', async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation: '過去12ヶ月の同業種案件では、予算確保から3ヶ月以内の導入案件の成約率は78%です。本案件も同条件のため、今週中のフォローアップを推奨します。具体的には、明日までに顧客の経理部門に予算承認状況を確認し、承認済みの場合は本日中に導入スケジュール案を提示してください。',
        pastPatternCount: 47,
        successRate: 78,
        matchingFactors: ['製造業', '予算500万円', '導入時期3ヶ月以内'],
        recommendedTimingUnit: '今週中',
        nextActions: ['経理部門への予算確認', '導入スケジュール案の提示'],
        confidenceScore: 82
      })
    };

    const dealData = {
      customerId: 'CUST-001',
      customerName: 'テスト製造業会社',
      industry: '製造業',
      dealStage: '提案前',
      budgetAmount: 5000000,
      implementationTimeline: '3ヶ月以内',
      dealConditions: {
        industry: '製造業',
        budgetRange: '500万円',
        timelineMonths: 3
      }
    };

    const result = await explainRecommendationReasoning(dealData, mockAIEngine);

    expect(result.explanation).toBeDefined();
    expect(typeof result.explanation).toBe('string');
    expect(result.explanation).toMatch(/過去12ヶ月/);
    expect(result.explanation).toMatch(/同業種案件/);
    expect(result.explanation).toMatch(/78%/);
    expect(result.explanation).toMatch(/今週中/);
    expect(result.explanation).toMatch(/成約率/);
    expect(result.explanation).toMatch(/推奨/);

    expect(result.pastPatternCount).toBe(47);
    expect(result.successRate).toBe(78);
    expect(Array.isArray(result.matchingFactors)).toBe(true);
    expect(result.matchingFactors).toContain('製造業');
    expect(result.matchingFactors).toContain('予算500万円');
    expect(result.matchingFactors).toContain('導入時期3ヶ月以内');

    expect(result.recommendedTimingUnit).toBe('今週中');
    expect(Array.isArray(result.nextActions)).toBe(true);
    expect(result.nextActions.length).toBeGreaterThan(0);
    expect(result.nextActions).toContain('経理部門への予算確認');
    expect(result.nextActions).toContain('導入スケジュール案の提示');

    expect(result.confidenceScore).toBe(82);
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(result.confidenceScore).toBeLessThanOrEqual(100);

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(dealData);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(1);
  });
});