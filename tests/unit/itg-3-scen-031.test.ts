import { validateMinimumDataRequirements } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-031: [normal] 学習データ量・品質検証機能 - 学習データが1件の場合に最小要件判定が正常に実行される
  test('学習データが1件の場合に最小要件判定が正常に実行される', () => {
    // Arrange
    const learningData = [
      {
        dealId: 'DEAL-001',
        customerId: 'CUST-001',
        customerIndustry: 'manufacturing',
        customerScale: 'large',
        proposalApproach: 'direct_approach',
        successFlag: true,
        dealAmount: 5000000,
        dealDuration: 90,
        salesPersonId: 'SP-001',
      },
    ];

    // Act
    const result = validateMinimumDataRequirements(learningData);

    // Assert
    expect(result).toEqual({
      status: 'WARNING',
      dataCount: 1,
      qualityScore: expect.any(Number),
      message: '学習データが不足しています。推奨精度が低下する可能性があります',
      dataValidation: {
        count: 1,
        qualityEvaluation: 'completed',
      },
    });

    // Verify quality score is between 0 and 100
    expect(result.qualityScore).toBeGreaterThanOrEqual(0);
    expect(result.qualityScore).toBeLessThanOrEqual(100);
  });
});