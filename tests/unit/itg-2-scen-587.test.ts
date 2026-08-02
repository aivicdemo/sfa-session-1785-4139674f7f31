import { executeApprovalJudgment } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-587: [normal] 修正ルール承認判定機能 - 営業管理職の操作ログに承認判定実行の記録が追記される
  test('should record approval judgment execution in operation log with correct timestamp and details', async () => {
    const test_execution_time = new Date('2024-03-15T14:30:00Z');
    const user_id = 'mgr_sales_001';
    const rule_id = 'normalize_rule_customer_name_001';
    const judgment_type = 'approve';
    const rule_details = {
      rule_id: rule_id,
      rule_name: '顧客名正規化ルール',
      description: '顧客名の全角・半角統一',
      sample_before: 'ＡＢＣ　Ｃｏｍｐａｎｙ',
      sample_after: 'ABC Company',
    };

    const result = await executeApprovalJudgment(
      user_id,
      rule_id,
      judgment_type,
      rule_details,
      test_execution_time
    );

    expect(result.operation_log_entry).toEqual({
      timestamp: new Date('2024-03-15T14:30:00Z'),
      user_id: 'mgr_sales_001',
      operation_type: '承認判定実行',
      target_rule_id: 'normalize_rule_customer_name_001',
      judgment_content: 'approve',
      execution_result_status: 'success',
    });

    expect(result.is_recorded).toBe(true);
    expect(result.time_difference_seconds).toBeLessThanOrEqual(10);
  });
});