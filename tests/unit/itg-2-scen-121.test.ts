import { detectDuplicateAndMergeJudgment } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と統合判定機能', () => {
  test('SCEN-121: 統合対象データの住所が空値の場合、他の属性で判定を継続する', () => {
    const cust_001 = {
      customer_id: 'CUST-001',
      name: '田中太郎',
      phone_number: '090-1234-5678',
      email: 'tanaka@example.com',
      address: '東京都渋谷区'
    };

    const cust_002 = {
      customer_id: 'CUST-002',
      name: '田中太郎',
      phone_number: '090-1234-5678',
      email: 'tanaka@example.com',
      address: ''
    };

    const result = detectDuplicateAndMergeJudgment([cust_001, cust_002]);

    expect(result.merge_judgment).toBe('統合対象');
    expect(result.matched_attributes).toContain('name');
    expect(result.matched_attributes).toContain('phone_number');
    expect(result.matched_attributes).toContain('email');
    expect(result.matched_attributes).not.toContain('address');
    expect(result.judgment_details).toEqual(
      expect.stringContaining('住所は空値のため判定対象外')
    );
  });
});