import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-854
  test('推奨内容の信頼度スコア算出・根拠提示機能 - 分析対象の過去商談データが null のとき、エラーで処理が進まない', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockImplementation(() => {
        const error = new Error('過去商談データが不正です');
        (error as any).code = 'INVALID_PAST_DEAL_DATA';
        throw error;
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const findSimilarPatternsSpy = jest.spyOn(mockAIEngine, 'findSimilarPatterns');
    const explainReasoningSpy = jest.spyOn(mockAIEngine, 'explainRecommendationReasoning');
    const uploadReportSpy = jest.spyOn(mockFileStorage, 'uploadRecommendationReport');

    const newDealCondition = {
      customerId: 'cust_12345',
      industry: 'manufacturing',
      companySize: 'large',
      dealAmount: 5000000,
    };

    const pastDealData = null;

    expect(() => {
      evaluatePatternRelevance(newDealCondition, pastDealData, mockAIEngine, mockFileStorage);
    }).toThrow(/過去商談データが不正です/);

    expect(findSimilarPatternsSpy).not.toHaveBeenCalled();
    expect(explainReasoningSpy).not.toHaveBeenCalled();
    expect(uploadReportSpy).not.toHaveBeenCalled();
  });
});