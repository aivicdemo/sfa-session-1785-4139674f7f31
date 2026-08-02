import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-132: [normal] 顧客データ重複検出・統合判定機能 - メールアドレスが完全一致する2レコードが重複候補として検出される', () => {
    // Arrange
    const customer_a = {
      id: 'CUST_A_001',
      name: '田中太郎',
      email: 'tanaka@example.com',
      phone: '090-1234-5678',
      company: 'ABC Corporation',
      created_at: '2024-01-01T10:00:00Z',
    };

    const customer_b = {
      id: 'CUST_B_002',
      name: '田中 太郎',
      email: 'tanaka@example.com',
      phone: '090-1234-5679',
      company: 'ABC Corp',
      created_at: '2024-01-02T14:30:00Z',
    };

    // Act
    const result = detectDuplicateCustomers([customer_a, customer_b]);

    // Assert
    expect(result).toEqual({
      duplicates: [
        {
          record_ids: ['CUST_A_001', 'CUST_B_002'],
          matched_field: 'email',
          confidence_score: 100,
        },
      ],
    });
    expect(result.duplicates[0].record_ids).toHaveLength(2);
    expect(result.duplicates[0].confidence_score).toBe(100);
    expect(result.duplicates[0].matched_field).toBe('email');
  });
});