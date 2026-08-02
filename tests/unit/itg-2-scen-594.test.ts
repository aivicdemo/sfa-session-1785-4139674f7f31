import { validateCustomerIdReferentialIntegrity } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-594
  test('一貫性検証で顧客ID参照整合性がすべて正常な場合、合格と判定される', () => {
    // Arrange
    const customerMasterStub = [
      { customerId: 'C001', customerName: 'Customer A' },
      { customerId: 'C002', customerName: 'Customer B' },
      { customerId: 'C003', customerName: 'Customer C' }
    ];

    const transactionTableStub = [
      { transactionId: 'T001', customerId: 'C001' },
      { transactionId: 'T002', customerId: 'C002' },
      { transactionId: 'T003', customerId: 'C003' }
    ];

    // Act
    const result = validateCustomerIdReferentialIntegrity(
      transactionTableStub,
      customerMasterStub
    );

    // Assert
    expect(result.status).toBe('PASS');
    expect(result.validationDetails.missingCustomerIds).toEqual([]);
    expect(result.validationDetails.inconsistencyCount).toBe(0);
  });
});