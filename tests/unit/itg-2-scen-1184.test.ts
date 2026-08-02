import { mergeCustomerDuplicates } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1184
  test('[normal] 顧客データの正規化・統合判定 - 統合時に重複する顧客データの古い方のレコードを保持して統合した場合、古いレコードの主要属性が統合後のデータに残される', async () => {
    const old_record = {
      customer_id: 'CUST-001',
      customer_name: '株式会社A',
      industry: '製造業',
      contact_person: '田中太郎',
      created_at: new Date('2023-01-15T00:00:00Z'),
    };

    const new_record = {
      customer_id: 'CUST-001',
      customer_name: '株式会社A',
      industry: '小売業',
      contact_person: '鈴木次郎',
      created_at: new Date('2024-01-15T00:00:00Z'),
    };

    const result = await mergeCustomerDuplicates(
      [old_record, new_record],
      { keep_older: true }
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      customer_id: 'CUST-001',
      customer_name: '株式会社A',
      industry: '製造業',
      contact_person: '田中太郎',
      created_at: new Date('2023-01-15T00:00:00Z'),
    });
  });
});