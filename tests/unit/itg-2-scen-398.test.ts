import { judgeIntegrationRecommendation } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-398
  test('統合判定で確度95%ちょうどと判定された顧客ペアが返される', () => {
    const customer_a = {
      customer_id: 'CUST-001',
      customer_name: '山田太郎',
      customer_email: 'yamada@example.com',
    };

    const customer_b = {
      customer_id: 'CUST-002',
      customer_name: '山田太郎',
      customer_email: 'yamada.taro@example.com',
    };

    const result = judgeIntegrationRecommendation({
      customer_pair: {
        customer_a,
        customer_b,
      },
      confidence_score: 95.0,
    });

    expect(result).toEqual({
      customer_a,
      customer_b,
      confidence_score: 95.0,
      merge_recommended: true,
    });
    expect(result.confidence_score).toBe(95.0);
    expect(result.merge_recommended).toBe(true);
  });
});