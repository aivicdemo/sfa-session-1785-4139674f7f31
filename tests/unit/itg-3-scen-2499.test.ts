import { generateRecommendationLogic } from '../../src/logic/it-1-br-3-3-2-1';

describe('営業成功パターンの構造化テンプレート設計機能', () => {
  // SCEN-2499
  test('新規案件の顧客・商談条件を入力し、推奨ロジック設定を推奨パターンマスタに保存する', async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(async (input) => ({
        recommendedApproach: '提案順序：課題ヒアリング→ソリューション説明→ROI試算',
        reasoning: '過去3年の類似案件15件中14件が成約',
        confidenceScore: 0.93,
        applicabilityEvaluation: 0.93,
      })),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const inputCondition = {
      industry: '製造業',
      productCategory: 'ERP',
      budgetScale: '5000万～1億円',
      decisionMakerCount: 3,
      timeline: '3ヶ月以内',
    };

    const fixedTimestamp = new Date('2024-01-15T10:30:00Z');
    const aiModelVersion = 'gpt-4-1106-preview';

    const result = await generateRecommendationLogic(
      inputCondition,
      mockAIRecommendationEngine,
      fixedTimestamp,
      aiModelVersion,
    );

    expect(result).toEqual({
      status: 'CONFIRMED',
      recommendedApproach:
        '提案順序：課題ヒアリング→ソリューション説明→ROI試算',
      reasoning: '過去3年の類似案件15件中14件が成約',
      relevanceScore: 0.93,
      timestamp: fixedTimestamp,
      aiModelVersion: aiModelVersion,
    });

    expect(result.status).toBe('CONFIRMED');
    expect(typeof result.recommendedApproach).toBe('string');
    expect(result.recommendedApproach.length).toBeGreaterThan(0);
    expect(typeof result.reasoning).toBe('string');
    expect(result.reasoning.length).toBeGreaterThan(0);
    expect(result.relevanceScore).toBeGreaterThanOrEqual(0.0);
    expect(result.relevanceScore).toBeLessThanOrEqual(1.0);
    expect(result.timestamp).toEqual(fixedTimestamp);
    expect(result.aiModelVersion).toBe(aiModelVersion);

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      inputCondition,
    );
  });
});