import { generateSalesPerformanceAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-144
  test('分析対象営業活動ログが空配列のときレポート生成が失敗する', () => {
    const emptyActivityLogs: any[] = [];
    const analysisParams = {
      activityLogs: emptyActivityLogs,
      standardProcessSteps: [
        { stepId: 'step_001', stepName: '初回接触', targetDaysFromStart: 0 },
        { stepId: 'step_002', stepName: '提案', targetDaysFromStart: 5 },
        { stepId: 'step_003', stepName: '交渉', targetDaysFromStart: 15 },
        { stepId: 'step_004', stepName: '成約', targetDaysFromStart: 30 }
      ],
      contractResults: [
        { contractId: 'contract_001', salesPersonId: 'person_001', contractAmount: 1000000, contractDate: '2024-01-31' }
      ]
    };

    const result = generateSalesPerformanceAnalysisReport(analysisParams);

    expect(result).toHaveProperty('errorCode');
    expect(result).toHaveProperty('errorMessage');
    expect(result.errorCode).toBe('EMPTY_ACTIVITY_LOG');
    expect(result.errorMessage).toMatch(/分析対象の営業活動ログが空/);
  });
});