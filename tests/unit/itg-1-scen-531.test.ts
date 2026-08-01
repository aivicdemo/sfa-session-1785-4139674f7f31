import { classifyProblemSeverity } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-531
  test('問題検出結果の重要度・優先度分類機能 - 最高重要度と最低重要度が正しく区別される', () => {
    const critical_problem = {
      severity: 'CRITICAL',
      priorityScore: 100,
      category: 'contract_violation',
    };

    const info_problem = {
      severity: 'INFO',
      priorityScore: 1,
      category: 'process_note',
    };

    const critical_classification = classifyProblemSeverity(critical_problem);
    const info_classification = classifyProblemSeverity(info_problem);

    expect(critical_classification.severity).toBe('CRITICAL');
    expect(critical_classification.priorityScore).toBe(100);
    expect(critical_classification.alertLevel).toBe('緊急対応必須');

    expect(info_classification.severity).toBe('INFO');
    expect(info_classification.priorityScore).toBe(1);
    expect(info_classification.alertLevel).toBe('参考情報');

    expect(critical_classification.severity).not.toBe(info_classification.severity);
    expect(critical_classification.priorityScore - info_classification.priorityScore).toBeGreaterThanOrEqual(99);
  });
});