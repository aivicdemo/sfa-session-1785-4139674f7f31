import { evaluateProposalViability } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1190: リスク要因が1件の場合に妥当性判定が実行される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.78,
        applicability: '条件付き適用可能',
        successPatternName: '製造業向け統合提案パターン_v2.1',
      }),
    };

    const proposalData = {
      customerIndustry: '製造業',
      budgetAmount: 5000000,
      decisionMakerCount: 2,
      riskFactors: ['既存システムとの統合課題'],
    };

    const result = evaluateProposalViability(proposalData, mockAIRecommendationEngine);

    expect(result).toEqual({
      riskEvaluationScore: 0.78,
      applicabilityJudgment: '条件付き適用可能',
      successPatternName: '製造業向け統合提案パターン_v2.1',
    });

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      proposalData
    );
  });
});