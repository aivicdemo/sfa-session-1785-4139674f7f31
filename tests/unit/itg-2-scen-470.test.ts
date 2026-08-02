import { detectDuplicateCustomers, removeDuplicatesFromCandidates, executeMergePredicate } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-470
  test('[normal] 顧客データ重複検出と統合判定 - 重複候補に同じ顧客IDが重複して含まれる場合、重複排除して判定が実行される', () => {
    const record1 = {
      customer_id: 'CUST-001',
      customer_name: '株式会社A',
      email: 'contact@company-a.jp',
      phone: '090-1234-5678',
      address: '東京都渋谷区',
      created_at: '2024-01-01T00:00:00Z',
    };

    const record2 = {
      customer_id: 'CUST-001',
      customer_name: '(株)A',
      email: 'contact@company-a.jp',
      phone: '090-1234-5678',
      address: '東京都渋谷区',
      created_at: '2024-01-05T00:00:00Z',
    };

    const record3 = {
      customer_id: 'CUST-001',
      customer_name: 'A株式会社',
      email: 'info@company-a.jp',
      phone: '090-1234-5678',
      address: '東京都渋谷区',
      created_at: '2024-01-10T00:00:00Z',
    };

    const records = [record1, record2, record3];

    const duplicateCandidates = detectDuplicateCustomers(records);

    expect(duplicateCandidates).toBeDefined();
    expect(Array.isArray(duplicateCandidates)).toBe(true);

    const uniqueDuplicateCandidates = removeDuplicatesFromCandidates(duplicateCandidates);

    expect(uniqueDuplicateCandidates.length).toBe(1);
    expect(uniqueDuplicateCandidates[0].customer_id).toBe('CUST-001');

    const mergeResult = executeMergePredicate(uniqueDuplicateCandidates, records);

    expect(mergeResult).toBeDefined();
    expect(mergeResult.status).toBe('統合可能');
    expect(mergeResult.merge_target_count).toBe(3);
    expect(mergeResult.merged_customer_id).toBe('CUST-001');
  });
});