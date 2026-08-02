import { detectDuplicateCustomers, mergeCustomerRecords } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客重複・不整合検出および統合判定機能', () => {
  // SCEN-639
  test('統合後データで更新日時が同一の場合、あらかじめ定義された優先度順序で選択される', () => {
    const priority_order = ['顧客マスタ', '営業活動履歴', '見積履歴'];
    
    const record_a = {
      customer_id: 'CUST001',
      name: '山田太郎',
      updated_at: new Date('2024-01-15T10:30:00Z'),
      source: '顧客マスタ'
    };
    
    const record_b = {
      customer_id: 'CUST002',
      name: '山田太郎',
      updated_at: new Date('2024-01-15T10:30:00Z'),
      source: '営業活動履歴'
    };
    
    const duplicate_detection_result = detectDuplicateCustomers([record_a, record_b]);
    expect(duplicate_detection_result.is_duplicate).toBe(true);
    expect(duplicate_detection_result.candidate_pairs.length).toBe(1);
    expect(duplicate_detection_result.candidate_pairs[0]).toEqual({
      record_1: record_a,
      record_2: record_b
    });
    
    const merge_result = mergeCustomerRecords({
      record_1: record_a,
      record_2: record_b,
      priority_order: priority_order
    });
    
    expect(merge_result.merged_record).toEqual({
      customer_id: 'CUST001',
      name: '山田太郎',
      updated_at: new Date('2024-01-15T10:30:00Z'),
      source: '顧客マスタ'
    });
    
    expect(merge_result.selected_source).toBe('顧客マスタ');
    expect(merge_result.discarded_source).toBe('営業活動履歴');
  });
});