import { evaluateProposalConstraintAlignment } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  test('SCEN-1306: 提案内容が顧客の予算制約を超過するとき、適合性スコアが負の値で計算される', () => {
    const proposalAmount = 5000000;
    const customerBudget = 3000000;
    const businessType = '製造業';
    const companySize = '中堅企業';
    const proposalContent = '高機能ERPパッケージ導入＋カスタマイズ';

    const stub_AIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalAmount: proposalAmount,
        proposalContent: proposalContent,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
    };

    const customerConstraints = {
      budgetLimit: customerBudget,
      businessType: businessType,
      companySize: companySize,
    };

    const result = evaluateProposalConstraintAlignment(
      {
        proposalAmount: proposalAmount,
        proposalContent: proposalContent,
      },
      customerConstraints,
      stub_AIRecommendationEngine
    );

    const expectedBudgetExcessAmount = proposalAmount - customerBudget;
    const expectedAlignmentScore = -0.667;

    expect(result.alignmentScore).toBeLessThan(0);
    expect(result.alignmentScore).toBeCloseTo(expectedAlignmentScore, 2);
    expect(result.budgetExcessAmount).toBe(expectedBudgetExcessAmount);
    expect(result.reasoningLog).toMatch(/顧客予算上限/);
    expect(result.reasoningLog).toMatch(/3000000/);
    expect(result.reasoningLog).toMatch(/5000000/);
    expect(result.reasoningLog).toMatch(/2000000/);
    expect(result.reasoningLog).toMatch(/超過/);
  });
});