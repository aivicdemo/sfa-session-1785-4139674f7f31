import { detectAndMergeCustomerDuplicates } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-826
  test('重複排除の正規化ルールを適用して顧客データが統合される', () => {
    const duplicateCustomers = [
      {
        customer_id: 'C001',
        name: '山田太郎',
        email: 'yamada@example.com',
        phone: '09012345678',
      },
      {
        customer_id: 'C002',
        name: '山田太郎',
        email: 'yamada@example.com',
        phone: '09012345678',
      },
    ];

    const mergeResult = detectAndMergeCustomerDuplicates(duplicateCustomers);

    expect(mergeResult.merged_customers).toHaveLength(1);
    expect(mergeResult.merged_customers[0]).toEqual({
      customer_id: 'C001',
      name: '山田太郎',
      email: 'yamada@example.com',
      phone: '09012345678',
    });

    expect(mergeResult.deleted_customer_ids).toContain('C002');
    expect(mergeResult.deleted_customer_ids).toHaveLength(1);

    expect(mergeResult.merge_logs).toHaveLength(1);
    expect(mergeResult.merge_logs[0]).toMatchObject({
      merge_target_id: 'C001',
      merge_source_id: 'C002',
      merge_rule: '重複排除',
    });
    expect(typeof mergeResult.merge_logs[0].merged_at).toBe('string');
    expect(mergeResult.merge_logs[0].merged_at).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/,
    );
  });
});