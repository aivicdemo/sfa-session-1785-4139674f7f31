import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-158
  test('[edge] 標準プロセス遵守度スコアが小数を含むとき、小数第2位で丸められる', () => {
    const employeeId = 'EMP-00123';
    const processComplianceScoreRaw = 87.456789;
    const expectedProcessComplianceScore = 87.46;

    const report = generateBehaviorPatternAnalysisReport({
      employeeId,
      processComplianceScoreRaw,
    });

    expect(report.processComplianceScore).toBe(expectedProcessComplianceScore);
  });
});