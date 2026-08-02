import { detectCustomerDuplicates } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1087
  test('電話番号が完全一致し他属性も一致するとき、重複と判定される', () => {
    const customerA = {
      customer_id: 'A001',
      phone_number: '09012345678',
      name: '山田太郎',
      email: 'yamada@example.com',
      address: '東京都渋谷区',
    };

    const customerB = {
      customer_id: 'B001',
      phone_number: '09012345678',
      name: '山田太郎',
      email: 'yamada@example.com',
      address: '東京都渋谷区',
    };

    const result = detectCustomerDuplicates(customerA, customerB);

    expect(result.is_duplicate).toBe(true);
    expect(result.status).toBe('DUPLICATE');
    expect(result.matching_reasons).toContain('電話番号完全一致');
    expect(result.matching_reasons).toContain('名前完全一致');
    expect(result.matching_reasons).toContain('メール完全一致');
    expect(result.matching_reasons).toContain('住所完全一致');
    expect(result.confidence_score).toBe(100);
  });
});