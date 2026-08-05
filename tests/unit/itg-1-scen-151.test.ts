import { determineInferenceExecutabilityWithAudit } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論実行可否判定機能', () => {
  test('SCEN-151: 学習データ量が最小要件をちょうど満たすとき推論実行が許可される', () => {
    // Arrange
    const minimumRequiredDataCount = 1000;
    const actualLearningDataCount = 1000;
    const timestamp = new Date('2024-01-15T11:00:00Z');

    const input = {
      learningDataCount: actualLearningDataCount,
      minimumRequiredDataCount: minimumRequiredDataCount,
      dataQualityScore: 95,
      executionTimestamp: timestamp,
    };

    // Act
    const result = determineInferenceExecutabilityWithAudit(input);

    // Assert
    expect(result.canExecute).toBe(true);
    expect(result.statusCode).toBe(200);
    expect(result.auditLog).toMatch(/学習データ量: 1000件/);
    expect(result.auditLog).toMatch(/判定結果: 推論実行許可/);
  });
});