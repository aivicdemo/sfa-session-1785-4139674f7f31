import { detectDuplicateCustomersWithTransitivity } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と統合判定機能', () => {
  // SCEN-123
  test('重複データがA-B、B-Cの場合、A-B-Cの推移的な関係を検出する', () => {
    const input = {
      customers: [
        {
          record_id: 'CUST_A',
          customer_name: 'Customer A',
          phone: '09012345678',
          email: 'customerA@example.com',
        },
        {
          record_id: 'CUST_B',
          customer_name: 'Customer B',
          phone: '09012345678',
          email: 'customerB@example.com',
        },
        {
          record_id: 'CUST_C',
          customer_name: 'Customer C',
          phone: '09087654321',
          email: 'customerB@example.com',
        },
      ],
      duplicate_relations: [
        {
          relation_id: 'REL_AB',
          record_id_a: 'CUST_A',
          record_id_b: 'CUST_B',
          match_score: 0.95,
          match_reason: '電話番号が同一',
        },
        {
          relation_id: 'REL_BC',
          record_id_a: 'CUST_B',
          record_id_b: 'CUST_C',
          match_score: 0.92,
          match_reason: 'メールアドレスが同一',
        },
      ],
    };

    const result = detectDuplicateCustomersWithTransitivity(input);

    expect(result.customer_groups).toHaveLength(1);
    
    const group = result.customer_groups[0];
    expect(group.group_id).toBeDefined();
    expect(group.member_record_ids).toEqual(
      expect.arrayContaining(['CUST_A', 'CUST_B', 'CUST_C'])
    );
    expect(group.member_record_ids).toHaveLength(3);

    expect(group.representative_record_id).toBe('CUST_A');

    expect(group.relations).toHaveLength(2);
    
    const relation_ab = group.relations.find(
      (rel) => rel.record_id_a === 'CUST_A' && rel.record_id_b === 'CUST_B'
    );
    expect(relation_ab).toBeDefined();
    expect(relation_ab?.match_score).toBe(0.95);
    expect(relation_ab?.match_reason).toBe('電話番号が同一');

    const relation_bc = group.relations.find(
      (rel) => rel.record_id_a === 'CUST_B' && rel.record_id_b === 'CUST_C'
    );
    expect(relation_bc).toBeDefined();
    expect(relation_bc?.match_score).toBe(0.92);
    expect(relation_bc?.match_reason).toBe('メールアドレスが同一');

    expect(group.is_transitive_consolidation).toBe(true);
  });
});