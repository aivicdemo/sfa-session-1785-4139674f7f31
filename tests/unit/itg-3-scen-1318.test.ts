import { evaluateProposalAgainstConstraints } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1318
  test('[normal] 提案内容と顧客制約条件の自動照合機能 - 提案内容データが1件のとき、その提案に対する照合判定が実行される', () => {
    const customerConstraints = {
      budgetLimit: 5000000,
      implementationPeriodMonths: 3,
      requiredFeatures: ['inventory_management']
    };

    const proposalData = [
      {
        proposalId: 'PROP-001',
        proposalAmount: 4800000,
        implementationPeriodMonths: 2,
        features: ['inventory_management', 'sales_analysis']
      }
    ];

    const aiRecommendationEngineStub = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        conformityScore: 0.95,
        conformityReason: '予算・期間・機能すべて制約内'
      })
    };

    const result = evaluateProposalAgainstConstraints(
      proposalData,
      customerConstraints,
      aiRecommendationEngineStub
    );

    expect(result.conformityJudgment).toBe('OK');
    expect(result.conformityScore).toBe(0.95);
    expect(result.nonConformingItems).toEqual([]);
    expect(result.evaluatedProposalCount).toBe(1);
    expect(aiRecommendationEngineStub.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(result.internalLog).toMatch(/提案1件に対する照合判定を完了/);
  });
});