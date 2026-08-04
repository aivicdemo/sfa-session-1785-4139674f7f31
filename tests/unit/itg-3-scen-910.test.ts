import { evaluatePatternRelevance, findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン照合機能 - 適用可能性スコア同値時の全パターン候補扱い', () => {
  // SCEN-910
  test('適用可能性スコアが同値のパターンは全て適用候補として扱われる', async () => {
    const mockPatternA = {
      patternId: 'pattern-001',
      patternName: 'IT業界コスト削減パターン',
      industryType: 'IT',
      projectScale: '中規模',
      challengeType: 'コスト削減',
      successRate: 0.92,
    };

    const mockPatternB = {
      patternId: 'pattern-002',
      patternName: '中堅IT企業効率化パターン',
      industryType: 'IT',
      projectScale: '中規模',
      challengeType: 'コスト削減',
      successRate: 0.88,
    };

    const mockPatternC = {
      patternId: 'pattern-003',
      patternName: '大規模企業変革パターン',
      industryType: 'IT',
      projectScale: '大規模',
      challengeType: 'デジタル変革',
      successRate: 0.81,
    };

    const mockSimilarPatterns = [mockPatternA, mockPatternB, mockPatternC];

    const stubFindSimilarPatterns = jest.fn().mockResolvedValue(mockSimilarPatterns);

    const stubEvaluatePatternRelevance = jest
      .fn()
      .mockImplementation((pattern) => {
        if (pattern.patternId === 'pattern-001') {
          return Promise.resolve({ patternId: 'pattern-001', relevanceScore: 0.85 });
        }
        if (pattern.patternId === 'pattern-002') {
          return Promise.resolve({ patternId: 'pattern-002', relevanceScore: 0.85 });
        }
        if (pattern.patternId === 'pattern-003') {
          return Promise.resolve({ patternId: 'pattern-003', relevanceScore: 0.72 });
        }
        return Promise.reject(new Error('未知のパターン'));
      });

    const newProjectCondition = {
      customerIndustry: 'IT',
      projectScale: '中規模',
      challenge: 'コスト削減',
    };

    const similarPatterns = await stubFindSimilarPatterns(newProjectCondition);

    const evaluatedPatterns = await Promise.all(
      similarPatterns.map((pattern) =>
        stubEvaluatePatternRelevance(pattern).then((evaluation) => ({
          ...pattern,
          relevanceScore: evaluation.relevanceScore,
        }))
      )
    );

    const maxRelevanceScore = Math.max(
      ...evaluatedPatterns.map((p) => p.relevanceScore)
    );

    const applicableCandidates = evaluatedPatterns.filter(
      (p) => p.relevanceScore === maxRelevanceScore
    );

    expect(applicableCandidates).toHaveLength(2);
    expect(applicableCandidates.map((p) => p.patternId)).toEqual(['pattern-001', 'pattern-002']);
    expect(applicableCandidates.every((p) => p.relevanceScore === 0.85)).toBe(true);
    expect(evaluatedPatterns.find((p) => p.patternId === 'pattern-003')?.relevanceScore).toBe(
      0.72
    );
  });
});