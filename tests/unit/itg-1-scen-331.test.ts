import { describe, test, expect } from '@jest/globals';
import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-331
  test('行動パターン分析結果が複数件の場合、すべての分析結果がレポートに含まれる', () => {
    const employeeId = 'EMP001';
    const analysisResults = [
      {
        patternId: 'PATTERN_A',
        patternName: '高頻度訪問型',
        detectedAt: new Date('2024-01-15T10:00:00Z'),
        score: 85,
        characteristicDescription: '月間訪問件数が業界平均の1.5倍以上で、顧客接触頻度が高い傾向'
      },
      {
        patternId: 'PATTERN_B',
        patternName: '長期商談型',
        detectedAt: new Date('2024-01-15T10:30:00Z'),
        score: 78,
        characteristicDescription: '平均商談期間が90日以上で、段階的な提案プロセスを採用'
      },
      {
        patternId: 'PATTERN_C',
        patternName: '提案重視型',
        detectedAt: new Date('2024-01-15T11:00:00Z'),
        score: 82,
        characteristicDescription: '商談あたりの提案資料数が平均3件以上で、綿密な提案戦略を展開'
      }
    ];

    const report = generateBehaviorPatternAnalysisReport(employeeId, analysisResults);

    expect(report.employeeId).toBe('EMP001');
    expect(report.analysisResultCount).toBe(3);
    expect(report.analysisResults).toHaveLength(3);
    expect(report.analysisResults[0]).toEqual({
      patternId: 'PATTERN_A',
      patternName: '高頻度訪問型',
      detectedAt: new Date('2024-01-15T10:00:00Z'),
      score: 85,
      characteristicDescription: '月間訪問件数が業界平均の1.5倍以上で、顧客接触頻度が高い傾向'
    });
    expect(report.analysisResults[1]).toEqual({
      patternId: 'PATTERN_B',
      patternName: '長期商談型',
      detectedAt: new Date('2024-01-15T10:30:00Z'),
      score: 78,
      characteristicDescription: '平均商談期間が90日以上で、段階的な提案プロセスを採用'
    });
    expect(report.analysisResults[2]).toEqual({
      patternId: 'PATTERN_C',
      patternName: '提案重視型',
      detectedAt: new Date('2024-01-15T11:00:00Z'),
      score: 82,
      characteristicDescription: '商談あたりの提案資料数が平均3件以上で、綿密な提案戦略を展開'
    });
  });
});