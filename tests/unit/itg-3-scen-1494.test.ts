import { evaluateDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('購買履歴データ品質判定機能', () => {
  test('SCEN-1494: [edge] 品質スコア99（許容閾値直下）で学習データ適格と判定される', () => {
    // Arrange
    const dataQualityScore = 99;
    const threshold = 100;
    const inputData = {
      purchaseHistoryId: 'PH-001',
      customerId: 'CUST-2024-001',
      purchaseDate: '2024-01-15',
      productCategory: 'Software',
      purchaseAmount: 500000,
      quantity: 5,
      dataQualityScore: dataQualityScore,
      qualityThreshold: threshold,
    };

    // Act
    const result = evaluateDataQuality(inputData);

    // Assert
    expect(result.isQualifiedForTraining).toBe(true);
    expect(result.status).toBe('QUALIFIED');
    expect(result.reasonMessage).toContain(
      'スコア99はデータ品質基準を満たしており、学習データとして使用可能です'
    );
  });
});