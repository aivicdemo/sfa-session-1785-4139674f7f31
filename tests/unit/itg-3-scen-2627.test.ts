import { evaluateSuccessPatternApplicability } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン自動判定機能', () => {
  // SCEN-2627
  test('顧客属性が不正な形式のとき、判定エラーが発生する', () => {
    const invalidCustomerAttributes = [
      {
        customerId: null,
        industry: 'Technology',
        companySize: 'Large',
      },
      {
        customerId: undefined,
        industry: 'Technology',
        companySize: 'Large',
      },
      {
        customerId: 'CUST-001',
        industry: null,
        companySize: 'Large',
      },
      {
        customerId: 'CUST-001',
        industry: 123,
        companySize: 'Large',
      },
      {
        customerId: 'CUST-001',
        industry: 'Technology',
        companySize: null,
      },
      {
        customerId: 'CUST-001',
        industry: 'Technology',
        companySize: ['Large'],
      },
      {
        customerId: '',
        industry: 'Technology',
        companySize: 'Large',
      },
      {
        customerId: 'CUST-001',
        industry: '',
        companySize: 'Large',
      },
    ];

    invalidCustomerAttributes.forEach((invalidAttribute) => {
      const result = evaluateSuccessPatternApplicability({
        customerId: invalidAttribute.customerId,
        industry: invalidAttribute.industry,
        companySize: invalidAttribute.companySize,
        dealValue: 500000,
        dealStage: 'Proposal',
      });

      expect(result.statusCode).toBe(400);
      expect(result.errorMessage).toMatch(/顧客属性の形式が不正です|Invalid customer attribute format/);
      expect(result.errorCode).toBe('INVALID_CUSTOMER_ATTRIBUTE');
      expect(result.recommendation).toBeUndefined();
    });
  });
});