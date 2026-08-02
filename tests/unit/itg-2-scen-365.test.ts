import { re_judgeCustomerDuplicateOnDataChange } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-365
  test('重複判定済みの顧客ペアに新たなデータ変更が発生した場合、再判定が実行される', () => {
    const customerA = {
      customer_id: 'CUST-001',
      customer_name: '山田太郎',
      address: '東京都渋谷区1-1-1',
    };

    const customerB = {
      customer_id: 'CUST-002',
      customer_name: '山田太郎',
      address: '東京都渋谷区1-1-1',
    };

    const initialDuplicatePair = {
      customer_id_a: 'CUST-001',
      customer_id_b: 'CUST-002',
      duplicate_status: '確定済み',
      confidence_score: 95,
      final_judgment_datetime: '2024-01-15T10:00:00Z',
    };

    const updatedCustomerA = {
      customer_id: 'CUST-001',
      customer_name: '山田太郎',
      address: '東京都新宿区2-2-2',
    };

    const currentTimestamp = '2024-01-15T11:30:00Z';

    const result = re_judgeCustomerDuplicateOnDataChange(
      initialDuplicatePair,
      updatedCustomerA,
      customerB,
      currentTimestamp,
    );

    expect(result.customer_id_a).toBe('CUST-001');
    expect(result.customer_id_b).toBe('CUST-002');
    expect(result.duplicate_status).toBe('再判定実行済み');
    expect(result.confidence_score).toBe(45);
    expect(result.final_judgment_datetime).toBe('2024-01-15T11:30:00Z');
  });
});