import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・重み付けルール生成機能', () => {
  // SCEN-2768
  test('[normal] 課題パターンの相関スコアが正の値として計算される', () => {
    const pastDealData = [
      {
        customerId: 'CUST001',
        industry: 'manufacturing',
        dealAmount: 5000000,
        timeToClose: 90,
        proposalApproach: 'cost_optimization',
        closed: true,
      },
      {
        customerId: 'CUST002',
        industry: 'manufacturing',
        dealAmount: 3500000,
        timeToClose: 75,
        proposalApproach: 'cost_optimization',
        closed: true,
      },
      {
        customerId: 'CUST003',
        industry: 'retail',
        dealAmount: 2000000,
        timeToClose: 45,
        proposalApproach: 'efficiency_improvement',
        closed: true,
      },
      {
        customerId: 'CUST004',
        industry: 'manufacturing',
        dealAmount: 4800000,
        timeToClose: 85,
        proposalApproach: 'cost_optimization',
        closed: true,
      },
    ];

    const currentCaseCondition = {
      industry: 'manufacturing',
      dealAmount: 4500000,
      primaryChallenge: 'cost_reduction',
      proposalApproach: 'cost_optimization',
    };

    const aiEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        correlationScores: [0.87, 0.72, 0.95, 0.58],
      }),
    };

    return evaluatePatternRelevance(pastDealData, currentCaseCondition, aiEngine).then(
      (result: { correlationScores: number[] }) => {
        expect(result).toBeDefined();
        expect(Array.isArray(result.correlationScores)).toBe(true);
        expect(result.correlationScores.length).toBe(4);

        result.correlationScores.forEach((score: number) => {
          expect(typeof score).toBe('number');
          expect(score).toBeGreaterThan(0);
          expect(score).toBeLessThanOrEqual(1);
        });

        expect(result.correlationScores[0]).toBeCloseTo(0.87, 2);
        expect(result.correlationScores[1]).toBeCloseTo(0.72, 2);
        expect(result.correlationScores[2]).toBeCloseTo(0.95, 2);
        expect(result.correlationScores[3]).toBeCloseTo(0.58, 2);

        const hasVariance = new Set(result.correlationScores).size > 1;
        expect(hasVariance).toBe(true);

        const sortedScores = [...result.correlationScores].sort((a, b) => a - b);
        expect(sortedScores[sortedScores.length - 1]).toBeGreaterThan(sortedScores[0]);
      }
    );
  });
});