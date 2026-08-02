import { detectDuplicateCustomers, confirmMergeTarget } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-162
  test('統合対象の確定時に、マスタレコードとして残すべきレコードが指定される', () => {
    // Setup: 統合対象として2件の重複顧客レコードを準備
    const recordA = {
      customer_id: 'CUST-001',
      customer_name: 'ABC Corporation',
      customer_email: 'contact@abc.com',
      is_master_record: false,
    };

    const recordB = {
      customer_id: 'CUST-002',
      customer_name: 'ABC Corp',
      customer_email: 'contact@abc.com',
      is_master_record: false,
    };

    // 重複検出ロジックにより両レコードが重複と判定されることを確認
    const duplicates = detectDuplicateCustomers([recordA, recordB]);
    expect(duplicates).toHaveLength(1);
    expect(duplicates[0]).toEqual({
      group_id: expect.any(String),
      record_ids: expect.arrayContaining(['CUST-001', 'CUST-002']),
      duplicate_count: 2,
      confidence_score: expect.any(Number),
    });

    // 統合判定画面でレコードAをマスタレコードとして指定
    const merge_result = confirmMergeTarget({
      duplicate_group_id: duplicates[0].group_id,
      master_record_id: 'CUST-001',
      records_to_merge: ['CUST-001', 'CUST-002'],
    });

    // 期待結果: 統合処理後、マスタレコード格納テーブルにはレコードAが単一レコードとして残存
    expect(merge_result.master_record).toEqual({
      customer_id: 'CUST-001',
      customer_name: 'ABC Corporation',
      customer_email: 'contact@abc.com',
      is_master_record: true,
      master_record_flag: 1,
    });

    // 統合済みレコード管理テーブルにはレコードBが移行レコードとして記録される
    expect(merge_result.merged_records).toHaveLength(1);
    expect(merge_result.merged_records[0]).toEqual({
      customer_id: 'CUST-002',
      customer_name: 'ABC Corp',
      customer_email: 'contact@abc.com',
      is_master_record: false,
      master_record_id: 'CUST-001',
      merge_status: 'merged',
    });

    // レコードAのマスタレコード指定フラグが1（True）に設定される
    expect(merge_result.master_record.master_record_flag).toBe(1);
    expect(merge_result.status).toBe('confirmed');
  });
});