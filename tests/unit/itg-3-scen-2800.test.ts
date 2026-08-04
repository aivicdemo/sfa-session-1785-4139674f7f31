import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2800: 根拠の信頼度スコアが欠けているとき、エラーを返す', () => {
    // 入力パラメータ
    const recommendationId = 'rec-12345';
    const customerInfo = {
      customerId: 'cust-67890',
      customerName: '株式会社テスト',
      industry: '製造業',
      scale: '中堅企業'
    };

    // AIRecommendationEngine のモック化
    // confidenceScore フィールドを省略したレスポンスを返す
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        recommendationId: recommendationId,
        reasoning: '過去の類似案件との比較から、このアプローチが最適と判断されました',
        supportingData: [
          {
            dataType: 'similar_case',
            caseId: 'case-001',
            matchRate: 0.92
          }
        ],
        riskFactors: ['予算制約'],
        // confidenceScore は意図的に省略
        timestamp: '2024-01-15T11:00:00Z'
      })
    };

    // 推奨根拠の可視化機能を実行
    const result = explainRecommendationReasoning(
      recommendationId,
      customerInfo,
      mockAIEngine
    );

    // 戻り値のエラーオブジェクトを検証
    expect(result).toEqual({
      isSuccess: false,
      errorCode: 'MISSING_CONFIDENCE_SCORE',
      errorMessage: '根拠の信頼度スコアが取得できません。推奨の可視化を中止します',
      httpStatusCode: 400,
      userMessage: '根拠情報が不完全です。別の推奨をお試しください',
      data: null
    });
  });
});