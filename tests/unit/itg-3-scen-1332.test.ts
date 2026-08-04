import { evaluateProposalFitness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 提案内容と顧客制約条件の自動照合', () => {
  // SCEN-1332
  test('同じ入力データで照合処理を2回実行したとき、2回とも同じ適合性スコアが返される', () => {
    const customerConstraint = {
      industry: '製造業',
      budgetAmount: 5000000,
      implementationPeriodMonths: 3,
    };

    const proposalContent = {
      proposalId: 'PROP-2024-001',
      solution: 'クラウドERP',
      price: 4500000,
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn(() => 0.87),
    };

    const firstFitnessScore = evaluateProposalFitness(
      customerConstraint,
      proposalContent,
      mockAIEngine
    );

    const secondFitnessScore = evaluateProposalFitness(
      customerConstraint,
      proposalContent,
      mockAIEngine
    );

    expect(firstFitnessScore).toBe(0.87);
    expect(secondFitnessScore).toBe(0.87);
    expect(firstFitnessScore).toEqual(secondFitnessScore);
  });
});