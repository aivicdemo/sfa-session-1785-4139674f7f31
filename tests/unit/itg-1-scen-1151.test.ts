import { describe, test, expect } from '@jest/globals';
import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1151
  test('標準プロセスとの乖離率が許容閾値直上（+5.1%）のとき警告範囲として分類される', () => {
    const salesPersonId = 'SP-001';
    const standardProcessDeviation = 5.1;
    const reportGenerationDate = new Date('2024-01-15T11:00:00Z');

    const behaviorPatternData = {
      salesPersonId: salesPersonId,
      analysisMonth: '2024-01',
      initialContactFrequency: 12,
      proposalSuccessRate: 0.65,
      followUpInterval: 5.2,
      standardProcessDeviation: standardProcessDeviation,
      contractAmount: 2500000,
      contractCount: 5,
      lossCount: 3,
      generatedAt: reportGenerationDate,
    };

    const result = generateBehaviorPatternAnalysisReport(behaviorPatternData);

    expect(result).toEqual(
      expect.objectContaining({
        salesPersonId: salesPersonId,
        deviationClassification: 'warning',
        deviationRate: 5.1,
        classificationFlag: 'warning',
        visualIndicator: 'yellow_alert',
        analysisMonth: '2024-01',
        requiresManagementAttention: true,
      })
    );

    expect(result.classificationFlag).toBe('warning');
    expect(result.visualIndicator).toBe('yellow_alert');
    expect(result.deviationRate).toBe(5.1);
  });
});