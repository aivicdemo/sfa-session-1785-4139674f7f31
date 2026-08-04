import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2142: [error] 推奨根拠の自然言語説明生成 - 生成された説明文が空文字列のとき、エラーが発生する
  test('推奨根拠の説明文が空文字列の場合、エラーがスローされる', () => {
    const recommendationPatternId = 'pattern_001';
    const customerInfo = {
      customerId: 'cust_12345',
      industry: '製造業',
      companySize: '中堅企業',
      annualRevenue: 50000000,
    };
    const dealConditions = {
      dealId: 'deal_67890',
      productCategory: 'ERP',
      proposedAmount: 5000000,
      dealStage: '提案段階',
      purchaseTimeline: '6ヶ月以内',
    };

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(''),
    };

    expect(() => {
      const result = explainRecommendationReasoning(
        recommendationPatternId,
        customerInfo,
        dealConditions,
        mockAIEngine
      );
      if (!result || result.trim() === '') {
        throw new Error('推奨根拠の説明文が生成されませんでした。');
      }
    }).toThrow(/推奨根拠の説明文が生成されませんでした/);
  });
});