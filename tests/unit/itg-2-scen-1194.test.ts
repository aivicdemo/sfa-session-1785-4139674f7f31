import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1194
  test('検出問題パターンの可視化 - 重複エラーの件数がちょうど5件の場合、件数が正確に集計される', () => {
    const duplicateRecords = [
      {
        customer_id: 'CUST001',
        customer_name: '株式会社A',
        phone_number: '03-1234-5678',
        email: 'contact@companya.jp',
        created_at: '2024-01-10T09:00:00Z',
        duplicate_group_id: 'DUP_GRP_001',
      },
      {
        customer_id: 'CUST002',
        customer_name: '株式会社A',
        phone_number: '03-1234-5678',
        email: 'contact@companya.jp',
        created_at: '2024-01-11T10:30:00Z',
        duplicate_group_id: 'DUP_GRP_001',
      },
      {
        customer_id: 'CUST003',
        customer_name: '株式会社A',
        phone_number: '03-1234-5679',
        email: 'contact@companya.jp',
        created_at: '2024-01-12T14:15:00Z',
        duplicate_group_id: 'DUP_GRP_001',
      },
      {
        customer_id: 'CUST004',
        customer_name: '株式会社B',
        phone_number: '03-9876-5432',
        email: 'info@companyb.jp',
        created_at: '2024-01-13T11:45:00Z',
        duplicate_group_id: 'DUP_GRP_002',
      },
      {
        customer_id: 'CUST005',
        customer_name: '株式会社B',
        phone_number: '03-9876-5432',
        email: 'info@companyb.jp',
        created_at: '2024-01-14T15:20:00Z',
        duplicate_group_id: 'DUP_GRP_002',
      },
    ];

    const result = detectDuplicateCustomers(duplicateRecords);

    expect(result.duplicate_error_count).toBe(5);
    expect(result.visualization_data).toEqual({
      duplicate_error_count: 5,
      duplicate_groups: [
        {
          group_id: 'DUP_GRP_001',
          member_count: 3,
        },
        {
          group_id: 'DUP_GRP_002',
          member_count: 2,
        },
      ],
    });
  });
});