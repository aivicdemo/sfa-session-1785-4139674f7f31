import { mergeCustomerRecords } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-883
  test('統合判定ロジックの入力項目である正規化後データが欠けているとき、処理は失敗する', () => {
    const input_normalized_customer_missing_all_required_fields = {
      merge_flag: true,
      duplicate_score: 0.95,
      normalized_customer_id: undefined,
      normalized_customer_name: null,
      normalized_email: undefined,
      normalized_phone: null,
      normalization_rule_applied: true,
      created_at: new Date('2024-01-15T11:00:00Z'),
    };

    expect(() =>
      mergeCustomerRecords(input_normalized_customer_missing_all_required_fields)
    ).toThrow(/正規化後データ/);
  });
});