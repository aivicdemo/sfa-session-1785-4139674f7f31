import { detectDataInconsistency } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-403: [normal] 顧客データ重複検出と統合判定機能 - 不整合検出で商談記録と顧客マスタの日付矛盾が検出される
  test('should detect date inconsistency between customer master and sales record and return HIGH severity alert', () => {
    const customer_id = 'C001';
    const customer_master_last_updated = '2024-01-15';
    const sales_record_created_date = '2024-01-10';
    const sales_record_id = 'SR-2024-001';
    const customer_master_id = 'CM-2024-001';

    const input = {
      customer_id: customer_id,
      customer_master_last_updated: customer_master_last_updated,
      sales_record_created_date: sales_record_created_date,
      sales_record_id: sales_record_id,
      customer_master_id: customer_master_id,
    };

    const result = detectDataInconsistency(input);

    expect(result).toEqual({
      customer_id: 'C001',
      alert_severity: 'HIGH',
      inconsistency_description:
        '商談作成日(2024-01-10)が顧客マスタ最終更新日(2024-01-15)より前である',
      affected_records: [sales_record_id, customer_master_id],
      is_inconsistent: true,
    });
  });
});