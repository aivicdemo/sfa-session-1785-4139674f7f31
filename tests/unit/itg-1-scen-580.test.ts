import { judgeProblemDetectionResult } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-580
  test('問題検出結果の重要度・対応必要性判定機能 - 根拠が明確に記録されている検出結果は判定対象として処理される', () => {
    const detectionResult = {
      id: 'detection-001',
      status: '未判定',
      basis: {
        type: '営業ルール違反',
        content: '顧客接触頻度が契約条件を下回る',
        recordedAt: '2024-01-15T10:30:00Z',
        recordedBy: 'user-001',
      },
      severity: '',
      actionRequired: '',
      referredBasis: '',
      judgmentExecutedAt: '',
    };

    const result = judgeProblemDetectionResult(detectionResult);

    expect(result.status).toBe('判定処理済み');
    expect(result.severity).toBe('高');
    expect(result.actionRequired).toBe('要対応');
    expect(result.referredBasis).toBe('営業ルール違反（顧客接触頻度が契約条件を下回る）');
    expect(result.judgmentExecutedAt).toMatch(/2024-01-15T10:30:\d{2}Z/);
  });
});