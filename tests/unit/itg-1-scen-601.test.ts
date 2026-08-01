import { evaluateDetectionResultsWithPriority } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-601
  test('[normal] 問題検出結果の重要度・対応必要性判定機能 - 検出結果の重複データが存在する場合両方について判定される', () => {
    const detectionResults = [
      {
        id: 'detection_001',
        problemContent: '営業提案資料の未提出',
        severity: 'high',
        detectedAt: new Date('2024-01-15T11:00:00Z'),
      },
      {
        id: 'detection_002',
        problemContent: '営業提案資料の未提出',
        severity: 'medium',
        detectedAt: new Date('2024-01-15T11:15:00Z'),
      },
    ];

    const result = evaluateDetectionResultsWithPriority(detectionResults);

    expect(result).toHaveLength(2);

    const highSeverityResult = result.find((r) => r.id === 'detection_001');
    expect(highSeverityResult).toBeDefined();
    expect(highSeverityResult?.severity).toBe('high');
    expect(highSeverityResult?.actionRequired).toBe('required');

    const mediumSeverityResult = result.find((r) => r.id === 'detection_002');
    expect(mediumSeverityResult).toBeDefined();
    expect(mediumSeverityResult?.severity).toBe('medium');
    expect(mediumSeverityResult?.actionRequired).toBe('recommended');

    result.forEach((item) => {
      expect(item.id).toBeDefined();
      expect(item.severity).toBeDefined();
      expect(item.actionRequired).toBeDefined();
    });
  });
});