import { evaluateRecommendationConfidence } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨内容の信頼度スコア算出・根拠提示機能', () => {
  test('SCEN-843: 新規案件の顧客・商談条件が過去成功パターンと照合不可のときエラーを返す', () => {
    const newDealData = {
      customer_industry: '宇宙産業',
      employee_count: 5001,
      budget_scale_yen: 500000000,
      proposal_category: 'システム構築',
      customer_id: 'CUST-NEW-001',
    };

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevance_scores: [],
      }),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const error = new Error('推奨パターン照合不可');
    (error as any).code = 'NO_MATCHING_PATTERNS';
    (error as any).statusCode = 422;

    mockAIRecommendationEngine.findSimilarPatterns.mockRejectedValueOnce(error);

    expect(async () => {
      await evaluateRecommendationConfidence(
        newDealData,
        mockAIRecommendationEngine
      );
    }).rejects.toThrow(/照合/);
  });
});