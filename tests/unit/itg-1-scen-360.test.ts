import { evaluateSystemHealthCheck } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-360
  test('システムヘルスチェック合格判定機能 - システム稼働率がちょうど合格基準値に達した場合に合格と判定される', () => {
    // Arrange
    const passingThreshold = 80;
    const systemUptimePercentage = 80;

    const input = {
      uptimePercentage: systemUptimePercentage,
      passingThreshold: passingThreshold,
    };

    // Act
    const result = evaluateSystemHealthCheck(input);

    // Assert
    expect(result.status).toBe('PASS');
    expect(result.judgment).toBe('合格');
    expect(result.message).toContain('システム稼働率80%：合格基準値に達しています');
  });
});