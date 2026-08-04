import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('類似顧客マッチング処理の一貫性検証', () => {
  // SCEN-1535
  test('同じ入力データで2回実行した場合、同一の顧客群と一致度スコアが返却される', async () => {
    // テスト用の顧客データセット準備
    const testCustomers = [
      {
        customerId: 'CUST001',
        industry: 'IT',
        salesRevenue: '1000-5000',
        dealStage: 'proposal'
      },
      {
        customerId: 'CUST002',
        industry: 'IT',
        salesRevenue: '1000-5000',
        dealStage: 'proposal'
      },
      {
        customerId: 'CUST003',
        industry: 'IT',
        salesRevenue: '1000-5000',
        dealStage: 'proposal'
      }
    ];

    // 新規案件の条件データ定義
    const newDealCondition = {
      industry: 'IT',
      salesRevenue: '1000-5000',
      dealStage: 'proposal'
    };

    // AIRecommendationEngine のモック設定
    const mockSimilarPatterns = [
      {
        customerId: 'CUST001',
        matchScore: 0.92157
      },
      {
        customerId: 'CUST002',
        matchScore: 0.87643
      },
      {
        customerId: 'CUST003',
        matchScore: 0.75428
      }
    ];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn(async () => mockSimilarPatterns)
    };

    // 1回目の実行
    const firstResult = await findSimilarPatterns(
      newDealCondition,
      testCustomers,
      mockAIEngine
    );

    // 1回目の結果を記録
    const firstCustomerIds = firstResult.map(r => r.customerId);
    const firstScores = firstResult.map(r => r.matchScore);

    // 2回目の実行
    const secondResult = await findSimilarPatterns(
      newDealCondition,
      testCustomers,
      mockAIEngine
    );

    // 2回目の結果を記録
    const secondCustomerIds = secondResult.map(r => r.customerId);
    const secondScores = secondResult.map(r => r.matchScore);

    // 1回目と2回目の顧客群リストを比較（顧客ID、順序）
    expect(firstCustomerIds).toEqual(['CUST001', 'CUST002', 'CUST003']);
    expect(secondCustomerIds).toEqual(['CUST001', 'CUST002', 'CUST003']);

    // 1回目と2回目の一致度スコア値を比較（小数点以下5桁まで完全一致）
    expect(firstScores[0]).toBe(0.92157);
    expect(secondScores[0]).toBe(0.92157);

    expect(firstScores[1]).toBe(0.87643);
    expect(secondScores[1]).toBe(0.87643);

    expect(firstScores[2]).toBe(0.75428);
    expect(secondScores[2]).toBe(0.75428);

    // 完全一致確認
    expect(firstResult).toEqual(secondResult);
  });
});