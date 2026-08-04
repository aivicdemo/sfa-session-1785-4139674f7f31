import { evaluateProposalComplianceWithConstraints } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 提案内容と顧客制約条件の自動照合', () => {
  test('SCEN-1407: 提案金額と制約予算の順序が逆のとき、正常に照合される', () => {
    // Arrange: 提案内容オブジェクト
    const proposalContent = {
      proposalAmount: 5000000,
    };

    // Arrange: 顧客制約条件オブジェクト
    const customerConstraint = {
      budgetConstraint: 3000000,
    };

    // Arrange: AIRecommendationEngineのモック
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({ score: 85 }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    // Act: 照合処理を実行
    const complianceResult = evaluateProposalComplianceWithConstraints(
      proposalContent.proposalAmount,
      customerConstraint.budgetConstraint,
      mockAIEngine
    );

    // Assert: 照合結果の検証
    expect(complianceResult).toEqual({
      isWithinBudget: false,
      proposalAmount: 5000000,
      budgetConstraint: 3000000,
      overageAmount: 2000000,
      complianceStatus: 'CONSTRAINT_VIOLATED',
    });

    // Assert: 各プロパティ値の個別検証
    expect(complianceResult.isWithinBudget).toBe(false);
    expect(complianceResult.proposalAmount).toBe(5000000);
    expect(complianceResult.budgetConstraint).toBe(3000000);
    expect(complianceResult.overageAmount).toBe(2000000);
    expect(complianceResult.complianceStatus).toBe('CONSTRAINT_VIOLATED');
  });
});