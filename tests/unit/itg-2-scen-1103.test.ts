import { judgeCustomerDuplicate } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1103
  test('メールアドレスが空文字列のとき、他の属性で重複判定が進行する', () => {
    const customerA = {
      customer_id: 'CUST001',
      email: '',
      name: '田中太郎',
      phone: '090-1234-5678',
    };

    const customerB = {
      customer_id: 'CUST002',
      email: '',
      name: '田中太郎',
      phone: '090-1234-5678',
    };

    const result = judgeCustomerDuplicate(customerA, customerB);

    expect(result.is_duplicate).toBe(true);
    expect(result.match_fields).toEqual(['name', 'phone']);
    expect(result.judgment_reason).toBe('氏名と電話番号が完全一致');
  });
});