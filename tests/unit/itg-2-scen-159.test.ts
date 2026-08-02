import { detectAndJudgeDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-159
  test('複数の重複候補グループが同時に検出されるとき、各グループが独立して判定される', () => {
    const input_customers = [
      { customer_id: 'A1', name: '山田太郎', phone: '090-1111-1111', email: 'yamada@example.com', address: '東京都新宿区' },
      { customer_id: 'A2', name: '山田太郎', phone: '090-1111-1111', email: 'yamada.taro@example.com', address: '東京都新宿区渋谷' },
      { customer_id: 'A3', name: '山田太郎', phone: '090-1111-1111', email: 'yamada.t@example.com', address: '東京都新宿区渋谷1-2-3' },
      { customer_id: 'B1', name: '田中花子', phone: '090-2222-2222', email: 'tanaka@example.com', address: '東京都渋谷区' },
      { customer_id: 'B2', name: '田中花子', phone: '090-2222-2223', email: 'tanaka@example.com', address: '東京都渋谷区道玄坂' },
    ];

    const input_judgments = [
      { group_id: 'GROUP_A', judgment: '統合する' },
      { group_id: 'GROUP_B', judgment: '統合しない' },
    ];

    const result = detectAndJudgeDuplicateCustomers(input_customers, input_judgments);

    expect(result.group_results).toHaveLength(2);

    const group_a_result = result.group_results.find((g) => g.group_id === 'GROUP_A');
    expect(group_a_result).toBeDefined();
    expect(group_a_result?.judgment).toBe('統合する');
    expect(group_a_result?.customer_ids).toEqual(['A1', 'A2', 'A3']);
    expect(group_a_result?.merged_customer_id).toBe('A1');
    expect(group_a_result?.merged_record_count).toBe(3);

    const group_b_result = result.group_results.find((g) => g.group_id === 'GROUP_B');
    expect(group_b_result).toBeDefined();
    expect(group_b_result?.judgment).toBe('統合しない');
    expect(group_b_result?.customer_ids).toEqual(['B1', 'B2']);
    expect(group_b_result?.merged_customer_id).toBeUndefined();
    expect(group_b_result?.merged_record_count).toBe(0);

    expect(result.total_groups_processed).toBe(2);
    expect(result.total_merged_records).toBe(3);
    expect(result.total_not_merged_records).toBe(2);
  });
});