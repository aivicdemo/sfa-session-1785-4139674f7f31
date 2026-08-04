import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2687
  test('複数の推奨内容の根拠が同じ参照成功パターンで重複するとき、重複が排除されて表示される', async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendations: [
          {
            id: 'rec-001',
            content: '推奨A',
            successPatternId: 'SP-001',
          },
          {
            id: 'rec-002',
            content: '推奨B',
            successPatternId: 'SP-001',
          },
          {
            id: 'rec-003',
            content: '推奨C',
            successPatternId: 'SP-001',
          },
        ],
      }),
      explainRecommendationReasoning: jest.fn().mockImplementation((recommendationId) => {
        return Promise.resolve({
          explanation: '過去3年間の同業種案件で成約率78%を記録した提案アプローチ',
          successPatternId: 'SP-001',
        });
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: 85,
      }),
    };

    const newDealData = {
      customerId: 'CUST-20240115-001',
      customerIndustry: '製造業',
      customerSize: '中堅企業',
      dealAmount: 5000000,
      dealStage: '提案前',
      dealConditions: {
        budget: 5000000,
        timeline: '2024年Q1内',
        decisionMaker: '経営層',
      },
    };

    const result = await explainRecommendationReasoning(
      {
        recommendations: [
          {
            id: 'rec-001',
            content: '推奨A',
            successPatternId: 'SP-001',
          },
          {
            id: 'rec-002',
            content: '推奨B',
            successPatternId: 'SP-001',
          },
          {
            id: 'rec-003',
            content: '推奨C',
            successPatternId: 'SP-001',
          },
        ],
      },
      mockAIRecommendationEngine
    );

    const deduplicatedReasons = result.explanations;

    const uniquePatternIds = new Set(
      deduplicatedReasons.map((reason) => reason.successPatternId)
    );
    expect(uniquePatternIds.size).toBe(1);

    const uniqueExplanations = new Set(
      deduplicatedReasons.map((reason) => reason.explanation)
    );
    expect(uniqueExplanations.size).toBe(1);

    expect(deduplicatedReasons).toHaveLength(1);
    expect(deduplicatedReasons[0]).toEqual({
      successPatternId: 'SP-001',
      explanation: '過去3年間の同業種案件で成約率78%を記録した提案アプローチ',
      relevanceScore: 85,
      referenceCount: 3,
    });
  });
});