import { validateSalesActivityRecord } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-1001
  test('提案・顧客対応記録の必須項目検証 - 営業担当者IDが空の場合にエラーが返される', () => {
    const input_record = {
      sales_staff_id: '',
      customer_name: '株式会社テスト',
      activity_date_time: new Date('2024-01-15T14:30:00Z'),
      activity_type: '提案',
      activity_content: '新製品の提案を実施',
    };

    expect(() => validateSalesActivityRecord(input_record)).toThrow(/営業担当者ID/);
  });
});