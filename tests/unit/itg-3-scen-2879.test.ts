import { evaluateProposalApproachRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨内容検証判定機能 - 提案アプローチの適用可能性判定', () => {
  test('SCEN-2879: 提案アプローチの適用可能性判定が null のとき、エラーを返す', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue(null),
    };

    const newProjectData = {
      customer_id: 'CUST-001',
      customer_name: 'Sample Corp',
      industry: 'Manufacturing',
      company_size: 'Large',
      deal_conditions: {
        deal_amount: 5000000,
        deal_stage: 'Proposal',
        deal_timeline_days: 30,
      },
      previous_similar_patterns: [
        {
          pattern_id: 'PAT-001',
          success_rate: 0.85,
          customer_attribute_match: 0.9,
        },
      ],
    };

    return evaluateProposalApproachRelevance(newProjectData, mockAIRecommendationEngine)
      .then(() => {
        fail('Expected function to throw an error');
      })
      .catch((error) => {
        expect(error.code).toBe('PATTERN_RELEVANCE_EVALUATION_FAILED');
        expect(error.message).toBe(
          '提案アプローチの適用可能性判定に失敗しました。外部サービスが有効な評価結果を返しませんでした。'
        );
        expect(error.statusCode).toBe(500);
      });
  });
});