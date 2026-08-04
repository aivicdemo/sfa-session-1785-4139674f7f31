import { calculateTrustScoreAndExplainReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-826: 推奨アクション時期データが null のとき、エラーが発生する', () => {
    // 正常な顧客データと商談条件を用意
    const customerData = {
      customerId: 'CUST-001',
      customerName: '株式会社テスト',
      industry: 'IT',
      scale: 'large',
      previousPurchaseHistory: [
        {
          purchaseDate: '2024-01-15',
          productCategory: 'software',
          amount: 500000,
        },
      ],
    };

    const dealConditions = {
      dealId: 'DEAL-001',
      proposalContent: 'クラウド導入支援サービス',
      estimatedAmount: 800000,
      targetDecisionMaker: 'CTO',
    };

    // AIRecommendationEngineのスタブ
    const aiEngineStub = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendedApproach: '段階的なクラウド導入',
        successPatternId: 'PATTERN-005',
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          caseId: 'CASE-123',
          similarity: 0.85,
          successRate: 0.92,
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        '類似案件での成功実績が高いため推奨'
      ),
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.88),
    };

    // actionTimingData を null に設定
    const actionTimingData = null;

    // 期待値: バリデーションエラー
    expect(() =>
      calculateTrustScoreAndExplainReasoning(
        customerData,
        dealConditions,
        actionTimingData,
        aiEngineStub
      )
    ).toThrow(/INVALID_ACTION_TIMING_DATA/);
  });
});