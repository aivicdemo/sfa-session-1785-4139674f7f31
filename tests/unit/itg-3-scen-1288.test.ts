import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1288
  test('成功パターンマッチング機能 - 商談条件の適合度がちょうど閾値（80%）のパターンが対象として含まれる', async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    mockAIRecommendationEngine.evaluatePatternRelevance.mockResolvedValue(80.0);
    mockAIRecommendationEngine.findSimilarPatterns.mockResolvedValue([
      {
        patternId: 'pattern-001',
        relevanceScore: 80.0,
        status: '対象',
        rationale: '顧客規模（中堅企業）、業界（IT）、予算帯（500万～1000万円）がマッチしました',
        successRate: 0.75,
        dealCount: 12,
        metadata: {
          targetIndustry: 'IT',
          targetSize: 'mid-market',
          budgetRange: '5000000-10000000',
        },
      },
      {
        patternId: 'pattern-002',
        relevanceScore: 65.5,
        status: '参考',
        rationale: '業界は異なるが予算帯が類似しています',
        successRate: 0.62,
        dealCount: 8,
        metadata: {
          targetIndustry: 'Manufacturing',
          targetSize: 'mid-market',
          budgetRange: '5000000-10000000',
        },
      },
    ]);

    const deal_condition = {
      customerSize: 'mid-market',
      industry: 'IT',
      budgetRange: '5000000-10000000',
      dealStage: 'needs_analysis',
      timeline: 'Q2-2024',
    };

    const result = await findSimilarPatterns(deal_condition, mockAIRecommendationEngine);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          patternId: 'pattern-001',
          relevanceScore: 80.0,
          status: '対象',
          rationale: '顧客規模（中堅企業）、業界（IT）、予算帯（500万～1000万円）がマッチしました',
        }),
      ])
    );

    const target_pattern = result.find((p) => p.relevanceScore === 80.0);
    expect(target_pattern).toBeDefined();
    expect(target_pattern?.patternId).toBe('pattern-001');
    expect(target_pattern?.relevanceScore).toBe(80.0);
    expect(target_pattern?.status).toBe('対象');
    expect(target_pattern?.rationale).toBeDefined();
    expect(target_pattern?.rationale).toContain('マッチしました');
  });
});