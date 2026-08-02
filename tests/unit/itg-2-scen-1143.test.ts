import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1143
  test('[normal] 重複データを含む顧客データセットの場合、すべての重複が検出される', () => {
    const customer_dataset = [
      {
        record_id: 'REC001',
        email: 'john.doe@example.com',
        company_name: 'ABC Corporation',
        phone: '03-1234-5678',
      },
      {
        record_id: 'REC002',
        email: 'john.doe@example.com',
        company_name: 'ABC Corp',
        phone: '03-1234-5678',
      },
      {
        record_id: 'REC003',
        email: 'john.doe@example.com',
        company_name: 'Abc Corporation',
        phone: '03-1234-5678',
      },
      {
        record_id: 'REC004',
        email: 'jane.smith@example.com',
        company_name: 'XYZ Inc',
        phone: '03-9876-5432',
      },
    ];

    const detection_result = detectDuplicateCustomers(customer_dataset);

    expect(detection_result.duplicate_groups).toHaveLength(1);
    expect(detection_result.duplicate_groups[0].record_ids).toHaveLength(3);
    expect(detection_result.duplicate_groups[0].record_ids).toEqual(
      expect.arrayContaining(['REC001', 'REC002', 'REC003'])
    );
    expect(detection_result.undetected_count).toBe(0);
    expect(detection_result.total_groups).toBe(1);
  });
});