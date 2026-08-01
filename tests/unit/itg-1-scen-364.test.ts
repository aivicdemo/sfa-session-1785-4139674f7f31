import { describe, it, expect } from '@jest/globals';
import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-364
  it('分析対象期間の終了日が欠落しているとき、エラーが発生する', () => {
    const analysisRequest = {
      startDate: '2024-01-01',
      endDate: null,
      salesRepId: 'EMP001',
      branchCode: 'BR001',
      reportFormat: 'JSON',
      includeDetailedMetrics: true
    };

    expect(() => generateSalesRepBehaviorAnalysisReport(analysisRequest)).toThrow(/終了日/);
  });
});