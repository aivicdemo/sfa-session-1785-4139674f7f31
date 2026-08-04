import { determineGuidancePolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 指導方針決定機能', () => {
  // SCEN-428: [normal] 指導方針決定機能 - スコア100点の場合、方針が「継続維持」と決定される
  test('スコア100のとき指導方針が継続維持となり、推奨パターン詳細が返される', () => {
    const qualityScore = 100;
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const successPatternData = {
      patternId: 'PAT-001',
      policyName: '継続維持',
      applicabilityScore: 95,
      description: '現状の営業プロセスを維持し、データ品質を定期監視する',
    };

    mockAIEngine.findSimilarPatterns.mockReturnValue([successPatternData]);

    const result = determineGuidancePolicy(qualityScore, mockAIEngine);

    expect(result.policy).toBe('継続維持');
    expect(result.patternId).toBe('PAT-001');
    expect(result.applicabilityScore).toBe(95);
    expect(result.description).toBe('現状の営業プロセスを維持し、データ品質を定期監視する');
  });
});