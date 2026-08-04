import { validateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 顧客データ完全性・妥当性判定', () => {
  test('SCEN-704: 顧客IDが既存顧客マスタに存在するとき、顧客データは妥当と判定される', async () => {
    // Arrange
    const customer_data = {
      customerId: 'CUST-20250801-001',
      customerName: '株式会社テスト',
      industryCode: '1234',
      contactEmail: 'test@example.com',
    };

    const customer_master_stub = {
      queryCustomerById: async (customer_id: string) => {
        if (customer_id === 'CUST-20250801-001') {
          return {
            status: 200,
            data: {
              customerId: 'CUST-20250801-001',
              customerName: '株式会社テスト',
              industryCode: '1234',
              contactEmail: 'test@example.com',
              registeredAt: '2025-08-01T00:00:00Z',
            },
          };
        }
        return { status: 404, data: null };
      },
    };

    // Act
    const result = await validateCustomerDataCompleteness(
      customer_data,
      customer_master_stub
    );

    // Assert
    expect(result.isValid).toBe(true);
    expect(result.validationStatus).toBe('VALID');
    expect(result.message).toBe(
      '顧客データは妥当です。既存顧客マスタと一致します。'
    );
  });
});