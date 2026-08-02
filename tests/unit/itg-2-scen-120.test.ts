import { detectDuplicateAndMergeJudgment } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-120
  test('メールアドレスが空値の場合、他の属性で判定を継続して統合対象と判定する', () => {
    const customer_data_a = {
      customer_id: 'CUST001',
      customer_name: '田中太郎',
      phone_number: '090-1234-5678',
      email_address: null,
    };

    const customer_data_b = {
      customer_id: 'CUST002',
      customer_name: '田中太郎',
      phone_number: '090-1234-5678',
      email_address: 'tanaka@example.com',
    };

    const result = detectDuplicateAndMergeJudgment(
      customer_data_a,
      customer_data_b
    );

    expect(result.is_merge_target).toBe(true);
    expect(result.merge_candidates).toContainEqual({
      customer_id_a: 'CUST001',
      customer_id_b: 'CUST002',
      match_attributes: ['customer_name', 'phone_number'],
    });
  });
});