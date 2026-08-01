import { classifyDetectionResultsPriority } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-532
  test('問題検出結果の重要度・優先度分類機能 - 最高優先度と最低優先度が正しく区別される', () => {
    const criticalDetectionResult = {
      priorityScore: 100,
      severityLevel: 'critical',
      detectionId: 'det-critical-001',
      issue: 'AI推論精度が閾値以下',
      timestamp: new Date('2024-01-15T11:00:00Z'),
    };

    const lowDetectionResult = {
      priorityScore: 1,
      severityLevel: 'low',
      detectionId: 'det-low-001',
      issue: '軽微な異常',
      timestamp: new Date('2024-01-15T11:05:00Z'),
    };

    const classifiedCritical = classifyDetectionResultsPriority(criticalDetectionResult);
    const classifiedLow = classifyDetectionResultsPriority(lowDetectionResult);

    expect(classifiedCritical.priorityScore).toBe(100);
    expect(classifiedCritical.severityLevel).toBe('critical');
    expect(classifiedLow.priorityScore).toBe(1);
    expect(classifiedLow.severityLevel).toBe('low');
    expect(classifiedCritical.priorityScore).toBeGreaterThan(classifiedLow.priorityScore);
  });
});