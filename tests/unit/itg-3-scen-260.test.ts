import { trackRecommendationResult } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  test('SCEN-260: [error] 推奨内容の結果追跡機能 - 推奨結果の状態フラグが定義済みの値以外のとき、結果追跡処理がエラーになる', () => {
    const invalidRecommendationResult = {
      recommendationId: 'REC-001',
      customerId: 'CUST-001',
      proposalApproach: 'approach_sample',
      status: 'INVALID_STATUS',
      createdAt: new Date('2024-01-15T11:00:00Z'),
    };

    expect(() => trackRecommendationResult(invalidRecommendationResult)).toThrow(/INVALID_STATUS_FLAG/);
  });
});