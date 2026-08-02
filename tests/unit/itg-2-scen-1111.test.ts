import { validate } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1111
  test('事例データの必須フィールドがnullである場合、検証に不合格となる', () => {
    const caseData = {
      customerId: null,
      transactionAmount: 150000,
      transactionDate: '2024-01-15T10:30:00Z'
    };

    const result = validate(caseData);

    expect(result.status).toBe('FAILED');
    expect(result.errorCode).toBe('REQUIRED_FIELD_NULL');
    expect(result.errorMessage).toContain('必須フィールド「顧客ID」がnullです');
  });
});