import { mergeOperationalData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-961
  test('営業担当者IDが入力されていない場合に処理が中断される', () => {
    const input_data = {
      sales_person_id: '',
      customer_name: '株式会社テスト',
      purchase_amount: 500000,
      purchase_datetime: '2024-01-15T14:30:00Z',
      product_category: '営業支援ツール',
      deal_id: 'DEAL-2024-001',
    };

    expect(() => mergeOperationalData(input_data)).toThrow(/営業担当者ID/);
  });
});