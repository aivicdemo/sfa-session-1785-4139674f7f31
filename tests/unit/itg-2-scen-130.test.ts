import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-130
  test('顧客名が完全一致する3レコード以上が重複候補グループとして検出される', () => {
    const input_customers = [
      {
        customer_id: 'CID-001',
        customer_name: '株式会社A',
        address: '東京都渋谷区道玄坂1-2-3',
        phone_number: '03-1111-1111',
        email: 'contact1@companya.jp'
      },
      {
        customer_id: 'CID-002',
        customer_name: '株式会社A',
        address: '神奈川県横浜市中区日本大通1',
        phone_number: '045-2222-2222',
        email: 'contact2@companya.jp'
      },
      {
        customer_id: 'CID-003',
        customer_name: '株式会社A',
        address: '大阪府大阪市北区中之島3-2-4',
        phone_number: '06-3333-3333',
        email: 'contact3@companya.jp'
      }
    ];

    const result = detectDuplicateCustomers(input_customers);

    expect(result).toEqual(
      expect.objectContaining({
        duplicate_groups: expect.arrayContaining([
          expect.objectContaining({
            group_name: '株式会社A',
            customer_ids: expect.arrayContaining(['CID-001', 'CID-002', 'CID-003']),
            record_count: 3
          })
        ])
      })
    );

    const target_group = result.duplicate_groups.find(
      (g: any) => g.group_name === '株式会社A'
    );
    expect(target_group).toBeDefined();
    expect(target_group.record_count).toBe(3);
    expect(target_group.customer_ids).toHaveLength(3);
    expect(target_group.customer_ids).toEqual(
      expect.arrayContaining(['CID-001', 'CID-002', 'CID-003'])
    );
  });
});