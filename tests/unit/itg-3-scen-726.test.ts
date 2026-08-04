import { validateDealDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-726
  test('推奨生成前データ完全性判定機能 - 商談予定日が過去日付のとき推奨生成不可と判定される', () => {
    const currentDate = new Date('2024-02-15T10:00:00Z');
    const pastDealDate = new Date('2024-01-15T09:00:00Z');

    const dealData = {
      dealId: 'DEAL-001',
      customerId: 'CUST-001',
      dealAmount: 5000000,
      productCategory: 'ERP',
      scheduledDate: pastDealDate,
      status: 'active',
      industry: 'manufacturing',
      companySize: 'large'
    };

    const result = validateDealDataCompleteness(dealData, currentDate);

    expect(result.isValid).toBe(false);
    expect(result.errorStatus).toBe('ValidationError');
    expect(result.errorCode).toBe('ERR_PAST_DEAL_DATE');
    expect(result.errorMessage).toMatch(/商談予定日が過去日付のため推奨生成できません/);
    expect(result.shouldCallAIEngine).toBe(false);
  });
});