import { identifyBestCandidatePattern } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-287
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 成功パターンの類似度スコアが完全に一致する場合、最上位候補として特定される', () => {
    const successPatterns = [
      {
        patternId: 'pattern_a',
        industry: '製造',
        budgetScale: 10000000,
        decisionMakerCount: 3,
        implementationMonths: 3,
        similarityScore: 1.0,
        isBestCandidate: false,
      },
      {
        patternId: 'pattern_b',
        industry: '製造',
        budgetScale: 10000000,
        decisionMakerCount: 3,
        implementationMonths: 3,
        similarityScore: 0.85,
        isBestCandidate: false,
      },
      {
        patternId: 'pattern_c',
        industry: '製造',
        budgetScale: 10000000,
        decisionMakerCount: 3,
        implementationMonths: 3,
        similarityScore: 0.72,
        isBestCandidate: false,
      },
    ];

    const proposalCondition = {
      industry: '製造',
      budgetScale: 10000000,
      decisionMakerCount: 3,
      implementationMonths: 3,
    };

    const result = identifyBestCandidatePattern(successPatterns, proposalCondition);

    expect(result).toHaveLength(3);

    const patternA = result.find(p => p.patternId === 'pattern_a');
    expect(patternA).toBeDefined();
    expect(patternA?.similarityScore).toBe(1.0);
    expect(patternA?.isBestCandidate).toBe(true);

    const patternB = result.find(p => p.patternId === 'pattern_b');
    expect(patternB).toBeDefined();
    expect(patternB?.similarityScore).toBe(0.85);
    expect(patternB?.isBestCandidate).toBe(false);

    const patternC = result.find(p => p.patternId === 'pattern_c');
    expect(patternC).toBeDefined();
    expect(patternC?.similarityScore).toBe(0.72);
    expect(patternC?.isBestCandidate).toBe(false);
  });
});