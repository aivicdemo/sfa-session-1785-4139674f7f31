import { validateDataCompletenessBeforeRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - データ完全性判定', () => {
  // SCEN-724
  test('推奨生成前データ完全性判定機能 - マスタに定義されていない業種コードが入力されたとき推奨生成不可と判定される', () => {
    const invalidIndustryCode = '9999';
    const caseInfo = {
      customerId: 'CUST-001',
      customerName: 'テスト顧客',
      industryCode: invalidIndustryCode,
      companySize: 'large',
      dealAmount: 5000000,
      dealStage: 'proposal',
    };

    const industryMaster = [
      { code: '0100', name: '情報通信業' },
      { code: '0200', name: '金融・保険業' },
      { code: '0300', name: '製造業' },
      { code: '0400', name: '卸売業' },
      { code: '0500', name: '小売業' },
    ];

    const result = validateDataCompletenessBeforeRecommendation(caseInfo, industryMaster);

    expect(result.isValid).toBe(false);
    expect(result.status).toBe('VALIDATION_ERROR');
    expect(result.errorMessage).toMatch(/業種コード/);
    expect(result.errorMessage).toMatch(/9999/);
    expect(result.errorMessage).toMatch(/定義されていません/);
    expect(result.canProceedToRecommendationGeneration).toBe(false);
  });
});