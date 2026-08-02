import { detectCustomerIdInconsistency } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-404: 提案履歴と商談記録の顧客ID矛盾が検出される', () => {
    // Arrange
    const proposalHistoryRecords = [
      {
        proposal_id: 'PROP-2024-001',
        customer_id: 'C001',
        customer_name: '株式会社A',
        created_at: '2024-01-15T10:00:00Z'
      }
    ];

    const dealRecords = [
      {
        proposal_id: 'PROP-2024-001',
        customer_id: 'C002',
        customer_name: '株式会社B',
        created_at: '2024-01-15T11:00:00Z'
      }
    ];

    // Act
    const result = detectCustomerIdInconsistency({
      proposal_histories: proposalHistoryRecords,
      deal_records: dealRecords
    });

    // Assert
    expect(result.inconsistencies).toHaveLength(1);
    expect(result.inconsistencies[0]).toEqual({
      proposal_id: 'PROP-2024-001',
      inconsistency_type: '顧客ID不一致',
      proposal_history_customer_id: 'C001',
      deal_record_customer_id: 'C002'
    });
  });
});