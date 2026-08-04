import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1601
  test('[edge] 類似顧客マッチング処理 - 提案内容データが入力されないとき、処理が中断され例外が発生する', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(() => {
        throw new Error('提案内容データが入力されていません');
      }),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const inputData = {
      customerId: 'CUST_12345',
      industry: '製造業',
      companySize: 'large',
      proposalContent: null,
      historicalData: [
        {
          caseId: 'CASE_001',
          customerId: 'CUST_98765',
          industry: '製造業',
          companySize: 'large',
          proposalApproach: 'Cost reduction through process optimization',
          successFlag: true,
        },
      ],
    };

    expect(() =>
      findSimilarPatterns(inputData, mockAIRecommendationEngine)
    ).toThrow(/提案内容データ/);
  });
});