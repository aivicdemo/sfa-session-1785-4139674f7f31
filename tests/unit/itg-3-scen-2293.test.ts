import { calculateAnomalyScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 異常パターン検出', () => {
  // SCEN-2293
  test('メトリクス設定が未設定のとき異常度判定がエラーになる', () => {
    const inputWithoutMetricsConfig = {
      proposalContent: {
        productCategory: 'software_license',
        proposedAmount: 500000,
        proposedQuantity: 10,
      },
      customerConstraints: {
        budgetLimit: 1000000,
        purchaseFrequency: 'monthly',
      },
      metricsConfiguration: undefined,
    };

    expect(() => calculateAnomalyScore(inputWithoutMetricsConfig)).toThrow(
      /メトリクスが未設定|Metrics configuration is not defined/
    );
  });
});