import { determineProposalApproachFromSuccessPatterns } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-273
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 決定要因が欠落している場合、パターンマッチングが実行されない', () => {
    const customerWithNullDecisionFactors = {
      customerId: 'CUST-001',
      customerName: '株式会社テスト',
      industry: 'IT',
      decisionFactors: null,
      budget: 1000000,
    };

    const successPatternMatrix = {
      patterns: [
        {
          patternId: 'PAT-001',
          industryMatch: 'IT',
          budgetRange: { min: 500000, max: 2000000 },
          proposalApproach: 'クラウド導入支援',
          timingRecommendation: 'Q2',
        },
        {
          patternId: 'PAT-002',
          industryMatch: 'IT',
          budgetRange: { min: 2000000, max: 5000000 },
          proposalApproach: 'デジタル変革コンサルティング',
          timingRecommendation: 'Q1',
        },
      ],
      findMatchingPatterns: jest.fn(() => []),
    };

    const result = determineProposalApproachFromSuccessPatterns(
      customerWithNullDecisionFactors,
      successPatternMatrix
    );

    expect(result).toBeNull();
    expect(successPatternMatrix.findMatchingPatterns).not.toHaveBeenCalled();
  });
});