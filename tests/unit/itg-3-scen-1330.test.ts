import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1330
  test('提案内容と顧客制約条件の自動照合機能 - 実装可能性スコアが計算されるとき、数値結果が画面に表示される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.85),
    };

    const customerConstraints = {
      budgetLimit: 5000000,
      implementationPeriodMonths: 3,
      supportedSystem: 'Windows',
    };

    const proposalContent = {
      proposalAmount: 4500000,
      implementationPeriodMonths: 2.5,
      supportedSystem: 'Windows',
    };

    const result = evaluatePatternRelevance(
      customerConstraints,
      proposalContent,
      mockAIRecommendationEngine
    );

    expect(result.feasibilityScore).toBe(0.85);
    expect(result.displayValue).toBe('0.85');
    expect(result.message).toBe(
      '照合完了：提案内容は顧客制約条件を満たす可能性が高いです'
    );
    expect(result.isFeasible).toBe(true);
  });
});