import { describe, test, expect } from '@jest/globals';
import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者行動パターン分析レポート生成機能', () => {
  // SCEN-342
  test('分析対象期間の終了日がnullのとき、エラーが発生する', () => {
    const analysisInput = {
      startDate: new Date('2024-01-01T00:00:00Z'),
      endDate: null,
      salesPersonIds: ['sp001', 'sp002'],
      includeMetrics: ['contactFrequency', 'proposalSuccessRate', 'followUpInterval']
    };

    expect(() => {
      generateSalesPersonBehaviorAnalysisReport(analysisInput);
    }).toThrow(/INVALID_END_DATE/);

    try {
      generateSalesPersonBehaviorAnalysisReport(analysisInput);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toContain('分析対象期間の終了日は必須項目です');
      }
    }
  });
});