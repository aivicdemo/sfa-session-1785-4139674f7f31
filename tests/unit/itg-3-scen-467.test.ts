import { evaluateInstructionalGuidance } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 指導施策推奨機能', () => {
  // SCEN-467
  test('スコアが高水準（61～80点）の場合、「注意喚起」が推奨される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(75),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        '顧客の購買シグナルが明確で、過去成功事例との類似度が高いため、このタイミングでの提案が効果的です。ただし、競合状況の把握が必要です。'
      ),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
    };

    const dealConditions = {
      customerId: 'CUST-001',
      customerName: 'ABC株式会社',
      industry: '製造業',
      scale: '中堅企業',
      dealAmount: 5000000,
      proposalContent: 'クラウドERP導入提案',
      dealStage: '提案準備段階',
    };

    const result = evaluateInstructionalGuidance(dealConditions, mockAIRecommendationEngine);

    expect(result.recommendationType).toBe('注意喚起');
    expect(result.scoreRange).toEqual({ min: 61, max: 80 });
    expect(result.score).toBe(75);
    expect(result.message).toBe('スコア61～80点：注意喚起が推奨されます');
    expect(result.reasoning).toBe(
      '顧客の購買シグナルが明確で、過去成功事例との類似度が高いため、このタイミングでの提案が効果的です。ただし、競合状況の把握が必要です。'
    );
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(dealConditions);
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(dealConditions, 75);
  });
});