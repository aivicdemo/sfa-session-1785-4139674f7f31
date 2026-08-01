import { determineProblemSeverityAndResponsibility } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-597
  test('問題検出結果の重要度・対応必要性判定機能 - 営業担当者の行動パターン分析結果が判定基礎データとして使用される', () => {
    const behavioralPatternAnalysisResult = {
      visitFrequencyPercentage: 50,
      contactPatternConcentration: true,
      avgVisitFrequency: 100,
      analysisScore: 45,
    };

    const detectionResult = {
      detectionContent: '訪問頻度が低下し、顧客接触が特定曜日に集中している傾向を検出',
      detectedAt: '2024-01-15T10:30:00Z',
      behavioralPatternAnalysisResult: behavioralPatternAnalysisResult,
    };

    const judgmentResult = determineProblemSeverityAndResponsibility(detectionResult);

    expect(judgmentResult).toEqual({
      severityLevel: 'high',
      actionRequirement: '営業プロセス改善指導が必要',
      judgmentBasis: '行動パターン分析結果（訪問頻度50%以下、接触パターン集中傾向）を基礎データとして使用',
      severityScore: 85,
    });

    expect(judgmentResult.severityLevel).toBe('high');
    expect(judgmentResult.actionRequirement).toBe('営業プロセス改善指導が必要');
    expect(typeof judgmentResult.severityScore).toBe('number');
    expect(judgmentResult.severityScore).toBe(85);
  });
});