import { mergeCustomerRecords } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-167
  test('マージ対象レコードが複数件のとき、全てのレコードがマスタレコードへ統合される', () => {
    const master_record = {
      customer_id: 'CUST001',
      customer_name: '山田太郎',
      phone_number: '090-1111-1111',
      is_deleted: 0,
    };

    const merge_record_b = {
      customer_id: 'CUST002',
      customer_name: '山田太郎',
      phone_number: '090-1111-1111',
      is_deleted: 0,
    };

    const merge_record_c = {
      customer_id: 'CUST003',
      customer_name: '山田太郎',
      phone_number: '090-1111-1111',
      is_deleted: 0,
    };

    const related_data_b = [
      {
        record_id: 'CUST002',
        data_type: 'sales_performance',
        amount: 150000,
      },
      {
        record_id: 'CUST002',
        data_type: 'contact_history',
        last_contact_date: '2024-01-10',
      },
      {
        record_id: 'CUST002',
        data_type: 'contract_info',
        contract_id: 'CTR002',
      },
    ];

    const related_data_c = [
      {
        record_id: 'CUST003',
        data_type: 'sales_performance',
        amount: 200000,
      },
      {
        record_id: 'CUST003',
        data_type: 'contact_history',
        last_contact_date: '2024-01-15',
      },
      {
        record_id: 'CUST003',
        data_type: 'contract_info',
        contract_id: 'CTR003',
      },
    ];

    const merge_targets = [
      {
        customer_record: merge_record_b,
        related_data: related_data_b,
      },
      {
        customer_record: merge_record_c,
        related_data: related_data_c,
      },
    ];

    const result = mergeCustomerRecords(master_record, merge_targets);

    expect(result.master_record.customer_id).toBe('CUST001');
    expect(result.master_record.customer_name).toBe('山田太郎');
    expect(result.master_record.phone_number).toBe('090-1111-1111');
    expect(result.master_record.is_deleted).toBe(0);

    expect(result.merged_records).toHaveLength(2);

    expect(result.merged_records[0].customer_id).toBe('CUST002');
    expect(result.merged_records[0].is_deleted).toBe(1);

    expect(result.merged_records[1].customer_id).toBe('CUST003');
    expect(result.merged_records[1].is_deleted).toBe(1);

    expect(result.reassigned_related_data).toHaveLength(6);

    const reassigned_from_b = result.reassigned_related_data.filter(
      (d) => d.original_customer_id === 'CUST002'
    );
    expect(reassigned_from_b).toHaveLength(3);
    reassigned_from_b.forEach((d) => {
      expect(d.new_customer_id).toBe('CUST001');
    });

    const reassigned_from_c = result.reassigned_related_data.filter(
      (d) => d.original_customer_id === 'CUST003'
    );
    expect(reassigned_from_c).toHaveLength(3);
    reassigned_from_c.forEach((d) => {
      expect(d.new_customer_id).toBe('CUST001');
    });
  });
});