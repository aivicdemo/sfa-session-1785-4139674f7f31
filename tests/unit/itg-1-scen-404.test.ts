import { validateCustomerResponsePattern } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-404
  test('顧客対応パターンレコードに必須属性（対応内容）が欠落している場合、エラーとして処理される', () => {
    const recordWithoutContactContent = {
      contactedAt: new Date('2024-01-15T10:00:00Z'),
      customerId: 'CUST-001',
      salesPersonId: 'SALES-001',
      responseContent: ''
    };

    const result = validateCustomerResponsePattern(recordWithoutContactContent);

    expect(result.errorCode).toBe('MISSING_REQUIRED_FIELD_CONTACT_CONTENT');
    expect(result.errorMessage).toBe('対応内容は必須項目です');
    expect(result.userNotification).toBe('顧客対応パターンの登録に失敗しました。対応内容を入力してください');
    expect(result.isSaved).toBe(false);
  });
});