import { validateSalesDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-375
  test('[normal] 商談記録の日付が空の場合、日付漏れとして検出される', () => {
    const dealRecord = {
      dealId: 'DEAL-001',
      salesPersonId: 'SALES-001',
      customerName: '株式会社テスト',
      dealDate: '',
      amount: 500000,
      stage: '提案',
    };

    const validationResult = validateSalesDataQuality(dealRecord);

    expect(validationResult.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          errorCode: 'DATE_MISSING',
          errorMessage: '商談記録の日付が入力されていません',
          fieldName: 'dealDate',
        }),
      ])
    );
    expect(validationResult.errors.length).toBeGreaterThanOrEqual(1);
  });
});