import { describe, test, expect } from '@jest/globals';
import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-385: 成約実績の成約金額が0のとき、成約実績として計算される', () => {
    const salesPersonId = 'SP001';
    const contractDate = new Date('2024-01-15T10:30:00Z');
    const projectName = 'テストプロジェクト';
    const contractAmount = 0;

    const contractResult = {
      salesPersonId: salesPersonId,
      contractDate: contractDate,
      projectName: projectName,
      contractAmount: contractAmount
    };

    const report = generateSalesPersonBehaviorAnalysisReport([contractResult]);

    expect(report.contractCount).toBe(1);
    expect(report.totalContractAmount).toBe(0);
  });
});