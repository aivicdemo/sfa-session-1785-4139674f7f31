import { validateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-759
  test('顧客データ完全性・妥当性判定機能 - 入力された企業規模が商談条件マスタに存在しないとき、推奨生成不可と判定される', () => {
    const customerData = {
      customerId: 'CUST-001',
      companyName: 'Test Company Inc.',
      industry: 'IT',
      companyScale: '超大規模エンタープライズ',
      location: 'Tokyo',
    };

    const dealConditionMasterStub = {
      getValidCompanyScales: jest.fn().mockResolvedValue(['大企業', '中堅企業', '中小企業', 'スタートアップ']),
    };

    const result = validateCustomerDataCompleteness(customerData, dealConditionMasterStub);

    expect(dealConditionMasterStub.getValidCompanyScales).toHaveBeenCalled();
    expect(result.status).toBe('推奨生成不可');
    expect(result.errorReason).toMatch(/企業規模「超大規模エンタープライズ」は商談条件マスタに存在しません/);
    expect(result.canGenerateRecommendation).toBe(false);
  });
});