import { integrateCommitmentAndSalesData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-969: 購買結果記録と商談記録が1件ずつの場合に正しく統合される', () => {
    // Arrange
    const dealRecord = {
      dealId: 'DEAL-001',
      customerId: 'CUST-123',
      dealAmount: 500000,
      dealStatus: '成約',
    };

    const purchaseRecord = {
      customerId: 'CUST-123',
      purchaseAmount: 500000,
      purchaseDate: '2024-01-15',
      purchaseStatus: '完了',
    };

    // Act
    const integratedResult = integrateCommitmentAndSalesData(
      dealRecord,
      purchaseRecord
    );

    // Assert
    expect(integratedResult).toEqual({
      dealId: 'DEAL-001',
      customerId: 'CUST-123',
      dealAmount: 500000,
      purchaseAmount: 500000,
      dealStatus: '成約',
      purchaseStatus: '完了',
      linkageStatus: '正常紐付け',
    });
  });
});