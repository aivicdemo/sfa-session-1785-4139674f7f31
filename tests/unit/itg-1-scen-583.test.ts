import { calculateInferencePrecisionAndAlerts } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-583
  test('[normal] 問題検出結果の重要度・対応必要性判定機能 - 検出結果が1件のみの場合その1件について判定される', () => {
    const detectionPayload = {
      problems: [
        {
          problemId: 'PROB-001',
          detectionContent: '営業プロセス未実施',
          detectionDateTime: '2024-01-15T10:30:00Z',
        },
      ],
    };

    const result = calculateInferencePrecisionAndAlerts(detectionPayload);

    expect(result.judgements).toHaveLength(1);
    expect(result.judgements[0].problemId).toBe('PROB-001');
    expect(result.judgements[0].importance).toBe('高');
    expect(result.judgements[0].actionRequired).toBe('必要');
    expect(result.totalProblemsJudged).toBe(1);
    expect(result.completedJudgements).toBe(1);
  });
});