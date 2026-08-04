import { validateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-746
  test('顧客データ完全性・妥当性判定機能 - 必須項目である商談条件が空文字列のとき、推奨生成不可と判定される', () => {
    const customerData = {
      customerId: 'CUST-001',
      customerName: '株式会社テスト',
      industry: '製造業',
      scale: 'large',
      dealCondition: '',
    };

    const result = validateCustomerDataCompleteness(customerData);

    expect(result.status).toBe('not_recommendable');
    expect(result.errorMessage).toMatch(/商談条件は必須項目です/);
    expect(result.errorMessage).toMatch(/空文字列は許容されません/);
    expect(result.canProceedToRecommendation).toBe(false);
  });
});