import { judgeCustomerMerge } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-881
  test('統合判定の信頼度スコアが閾値を1ポイント超えるとき、統合推奨と判定される', () => {
    const merge_threshold = 70;
    const confidence_score = 71;

    const customer_record_1 = {
      customer_id: 'CUST001',
      customer_name: '株式会社A',
      postal_code: '100-0001',
      address: '東京都千代田区',
    };

    const customer_record_2 = {
      customer_id: 'CUST002',
      customer_name: '(株)A',
      postal_code: '100-0001',
      address: '東京都千代田区',
    };

    const result = judgeCustomerMerge({
      record_1: customer_record_1,
      record_2: customer_record_2,
      threshold: merge_threshold,
      confidence_score: confidence_score,
    });

    expect(result.merge_judgment).toBe('統合推奨');
    expect(result.confidence_score).toBe(71);
  });
});