import { analyzeProcessDeviationAndCorrelation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-860
  test('営業プロセス標準書との乖離分析と成約実績の相関分析 - 重複する行動パターンを集約して相関を計算する', () => {
    const salesPersonId = 'A001';
    
    const behaviorPatterns = [
      {
        salesPersonId: 'A001',
        processStage: '初回接触',
        actionType: '訪問',
        deviationScore: 0.15,
        executionDate: '2024-01-10',
      },
      {
        salesPersonId: 'A001',
        processStage: '初回接触',
        actionType: '訪問',
        deviationScore: 0.15,
        executionDate: '2024-01-10',
      },
      {
        salesPersonId: 'A001',
        processStage: '初回接触',
        actionType: '訪問',
        deviationScore: 0.15,
        executionDate: '2024-01-10',
      },
      {
        salesPersonId: 'A001',
        processStage: '提案',
        actionType: '提案資料作成',
        deviationScore: 0.22,
        executionDate: '2024-01-12',
      },
      {
        salesPersonId: 'A001',
        processStage: '提案',
        actionType: '提案資料作成',
        deviationScore: 0.22,
        executionDate: '2024-01-12',
      },
    ];

    const contractResults = [
      {
        salesPersonId: 'A001',
        contractAmount: 500000,
        contractDate: '2024-01-20',
      },
    ];

    const result = analyzeProcessDeviationAndCorrelation({
      behaviorPatterns,
      contractResults,
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-01-31',
    });

    expect(result.inputRecordCount).toBe(5);
    expect(result.aggregatedRecordCount).toBe(2);
    expect(result.aggregatedPatterns).toHaveLength(2);
    
    expect(result.aggregatedPatterns[0]).toEqual({
      salesPersonId: 'A001',
      processStage: '初回接触',
      actionType: '訪問',
      deviationScore: 0.15,
      executionDate: '2024-01-10',
      occurrenceCount: 3,
    });
    
    expect(result.aggregatedPatterns[1]).toEqual({
      salesPersonId: 'A001',
      processStage: '提案',
      actionType: '提案資料作成',
      deviationScore: 0.22,
      executionDate: '2024-01-12',
      occurrenceCount: 2,
    });

    expect(result.correlationCoefficient).toBe(0.87);
    expect(result.correlationFormula).toBe('Pearson');
    
    expect(result.metadata).toEqual({
      inputRecordCount: 5,
      aggregatedRecordCount: 2,
      aggregationExecutionDateTime: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/),
      correlationCalculationFormula: 'Pearson correlation coefficient',
      dataSetUsedForAnalysis: 2,
      verifiable: true,
    });
  });
});