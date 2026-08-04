import { visualizeRecommendationRationale } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1902: [edge] 推奨根拠の可視化機能 - 過去成功事例が1件のときに根拠として該当事例が返却される
  test('過去成功事例が1件のとき、該当事例と根拠説明が返却される', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          caseId: 'SUCCESS-001',
          industryType: '製造業',
          proposalAmount: 5000000,
          successRateScore: 0.95,
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.92),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        '過去成功事例SUCCESS-001（製造業、提案額500万円）と顧客属性が合致するため、同一アプローチを推奨します',
      ),
      generateRecommendation: jest.fn(),
    };

    const newProjectData = {
      industryType: '製造業',
      proposalAmount: 5200000,
    };

    const result = visualizeRecommendationRationale(newProjectData, mockAIEngine);

    expect(result.similarCases).toHaveLength(1);
    expect(result.similarCases[0].caseId).toBe('SUCCESS-001');
    expect(result.similarCases[0].industryType).toBe('製造業');
    expect(result.similarCases[0].proposalAmount).toBe(5000000);
    expect(result.similarCases[0].successRateScore).toBe(0.95);

    expect(result.explanationText).toBe(
      '過去成功事例SUCCESS-001（製造業、提案額500万円）と顧客属性が合致するため、同一アプローチを推奨します',
    );

    expect(result.applicabilityScore).toBe(0.92);

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newProjectData);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      newProjectData,
      result.similarCases[0],
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      newProjectData,
      result.similarCases,
      0.92,
    );
  });
});