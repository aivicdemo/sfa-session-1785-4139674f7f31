import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能', () => {
  // SCEN-1737
  test('AIエージェント推奨が正常に完了したとき推奨スコアを計算する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        status: 'success',
        recommendation: {
          approach: '提案アプローチA',
          confidence: 0.92
        },
        patterns: [
          { patternId: 'PAT-001', relevanceScore: 0.88 },
          { patternId: 'PAT-002', relevanceScore: 0.75 }
        ],
        reasoning: '根拠説明文'
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue([0.88, 0.75])
    };

    const input = {
      customerInfo: {
        industry: 'IT',
        companySize: 'large',
        annualRevenue: 5000000000
      },
      dealConditions: {
        proposalValue: 1000000,
        dealStage: 'negotiation',
        timeline: 30
      }
    };

    const result = calculateRecommendationScore(input, mockAIEngine);

    expect(result).toEqual({
      score: 81.5,
      status: 'calculated',
      timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    });

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(input);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith([
      { patternId: 'PAT-001', relevanceScore: 0.88 },
      { patternId: 'PAT-002', relevanceScore: 0.75 }
    ]);
  });
});