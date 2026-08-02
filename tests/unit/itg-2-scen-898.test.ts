import { validateCustomerPurchaseData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-898
  test('提案内容が存在するが提案金額フィールドが欠落している場合、不整合エラーを検出する', () => {
    const testData = {
      customerId: 'CUST001',
      proposalContent: '新規営業システム導入提案',
      proposalAmount: '',
      purchaseDecisionDate: '2024-01-15',
    };

    const result = validateCustomerPurchaseData(testData);

    expect(result).toBeDefined();
    expect(result.errorCode).toBe('MISSING_PROPOSAL_AMOUNT');
    expect(result.errorMessage).toBe('提案内容が存在する場合、提案金額は必須項目です');
    expect(result.fieldName).toBe('proposalAmount');
    expect(result.isValid).toBe(false);
  });
});