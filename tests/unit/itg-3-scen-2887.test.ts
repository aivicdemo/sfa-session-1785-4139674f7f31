import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨内容検証判定機能 - 照合スコア検証', () => {
  // SCEN-2887
  test('照合スコアが負の値のとき、エラーを返す', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: -0.5,
        isApplicable: false,
      }),
    };

    const customerConditions = {
      industry: '製造業',
      companySize: '中堅企業',
      budget: 5000000,
      timeline: '3ヶ月以内',
    };

    const dealConditions = {
      productCategory: 'クラウドERP',
      salesStage: '提案段階',
      competitorPresence: true,
      decisionMakerLevel: '部長級',
    };

    const result = evaluatePatternRelevance(
      mockAIEngine,
      customerConditions,
      dealConditions
    );

    expect(result).toEqual({
      errorCode: 'INVALID_RELEVANCE_SCORE',
      errorMessage: '照合スコアが有効な範囲外です。0以上の値が必要です',
      isValid: false,
      fallbackAction: 'CACHE_FALLBACK',
    });

    expect(result.errorCode).toBe('INVALID_RELEVANCE_SCORE');
    expect(result.fallbackAction).toBe('CACHE_FALLBACK');
  });
});