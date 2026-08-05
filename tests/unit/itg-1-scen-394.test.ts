import { evaluateSuccessPatternApplicability } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-394: 成功パターンマトリクス適用判定機能 - 営業担当者の過去成約率が成功パターン要求値を下回るとき適用除外となる', () => {
    // Arrange: テストデータの準備
    const successPatternMatrixDefinition = {
      productA: {
        requiredSuccessRate: 70,
        description: '営業品目A',
      },
    };

    const salesPersonContractionRecord = {
      salesPersonName: '太郎',
      pastContractionRatePercentage: 65,
      evaluationPeriodMonths: 12,
    };

    const applicabilityJudgmentRequest = {
      successPatternKey: 'productA',
      salesPersonRecord: salesPersonContractionRecord,
      matrixDefinition: successPatternMatrixDefinition,
    };

    // Act: 適用判定ロジックを実行
    const result = evaluateSuccessPatternApplicability(applicabilityJudgmentRequest);

    // Assert: 判定結果を検証
    expect(result.applicable).toBe(false);
    expect(result.exclusionReason).toMatch(/成約率/);
    expect(result.exclusionReason).toMatch(/65/);
    expect(result.exclusionReason).toMatch(/70/);
  });
});