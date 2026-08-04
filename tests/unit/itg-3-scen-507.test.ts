import { decideSalesGuidancePolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 指導方針決定機能', () => {
  // SCEN-507
  test('指導内容がnullのとき、TypeError が投げられ、エラーコード GUIDANCE_CONTENT_NULL が含まれる', () => {
    const salesPersonId = 'sales-001';
    const salesPersonName = '山田太郎';
    const guidanceContent = null;

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-001',
        approach: 'test-approach',
        confidenceScore: 85,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() => {
      decideSalesGuidancePolicy(
        {
          salesPersonId,
          salesPersonName,
          guidanceContent,
        },
        mockAIEngine,
      );
    }).toThrow(/GUIDANCE_CONTENT_NULL/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});