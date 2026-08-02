import { detectDuplicateAndMismatch } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-219
  test('重複候補データに重複エントリが含まれるとき、それぞれ独立して判定される', () => {
    const duplicateCandidates = [
      {
        id: 'record_1',
        name: '顧客A',
        phone: '090-1111-1111',
        email: 'customer_a@example.com',
        address: '東京都渋谷区',
      },
      {
        id: 'record_2',
        name: '顧客A',
        phone: '090-2222-2222',
        email: 'customer.a@example.com',
        address: '東京都渋谷区',
      },
      {
        id: 'record_3',
        name: '顧客A',
        phone: '090-3333-3333',
        email: 'customer_a@example.com',
        address: '東京都渋谷区渋谷',
      },
    ];

    const result = detectDuplicateAndMismatch(duplicateCandidates);

    expect(result).toHaveLength(3);

    const pair_1_2 = result.find(
      (r) =>
        (r.record1_id === 'record_1' && r.record2_id === 'record_2') ||
        (r.record1_id === 'record_2' && r.record2_id === 'record_1')
    );
    expect(pair_1_2).toBeDefined();
    expect(pair_1_2!.duplicate_score).toBe(0.85);
    expect(pair_1_2!.mismatch_fields).toEqual(
      expect.arrayContaining(['phone', 'email'])
    );
    expect(pair_1_2!.mismatch_fields.length).toBe(2);

    const pair_1_3 = result.find(
      (r) =>
        (r.record1_id === 'record_1' && r.record2_id === 'record_3') ||
        (r.record1_id === 'record_3' && r.record2_id === 'record_1')
    );
    expect(pair_1_3).toBeDefined();
    expect(pair_1_3!.duplicate_score).toBe(0.8);
    expect(pair_1_3!.mismatch_fields).toEqual(
      expect.arrayContaining(['phone', 'address'])
    );
    expect(pair_1_3!.mismatch_fields.length).toBe(2);

    const pair_2_3 = result.find(
      (r) =>
        (r.record1_id === 'record_2' && r.record2_id === 'record_3') ||
        (r.record1_id === 'record_3' && r.record2_id === 'record_2')
    );
    expect(pair_2_3).toBeDefined();
    expect(pair_2_3!.duplicate_score).toBe(0.82);
    expect(pair_2_3!.mismatch_fields).toEqual(
      expect.arrayContaining(['email', 'address'])
    );
    expect(pair_2_3!.mismatch_fields.length).toBe(2);
  });
});