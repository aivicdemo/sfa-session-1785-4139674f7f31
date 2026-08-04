import { validateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-757: 顧客データ完全性・妥当性判定機能 - 複数件の商談条件マスタ照合時に推奨生成可能と判定される', () => {
    // テストデータセットアップ: 商談条件マスタ
    const dealConditionMasters = [
      {
        id: 1,
        industry: '製造業',
        budget: '1000万円以上',
        decisionMaker: '経営層',
        successRate: 85,
      },
      {
        id: 2,
        industry: '製造業',
        budget: '500万円以上',
        decisionMaker: '部門長',
        successRate: 72,
      },
      {
        id: 3,
        industry: '流通業',
        budget: '1000万円以上',
        decisionMaker: '経営層',
        successRate: 68,
      },
    ];

    // 入力値: 顧客データ
    const customerData = {
      industry: '製造業',
      budget: '800万円',
      decisionMaker: '経営層',
    };

    // AIRecommendationEngineスタブ
    const aiRecommendationEngineStub = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          masterId: 1,
          industry: '製造業',
          budget: '1000万円以上',
          decisionMaker: '経営層',
          successRate: 85,
          matchScore: 0.92,
        },
        {
          masterId: 2,
          industry: '製造業',
          budget: '500万円以上',
          decisionMaker: '部門長',
          successRate: 72,
          matchScore: 0.78,
        },
      ]),
    };

    // 顧客データ完全性・妥当性判定機能を呼び出し
    const validationResult = validateCustomerDataCompleteness(
      customerData,
      dealConditionMasters,
      aiRecommendationEngineStub
    );

    // 判定結果をアサーション
    expect(validationResult.isComplete).toBe(true);
    expect(validationResult.isValid).toBe(true);
    expect(validationResult.canGenerateRecommendation).toBe(true);
    expect(validationResult.matchedMasterCount).toBe(2);
    expect(validationResult.matchedMasterIds).toEqual([1, 2]);
    expect(validationResult.recommendationStatus).toBe('RECOMMENDATION_READY');
  });
});