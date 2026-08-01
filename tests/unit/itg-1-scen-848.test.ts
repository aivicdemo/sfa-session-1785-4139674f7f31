import { analyzeProcessDeviationAndCorrelation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-848
  test('[normal] 営業プロセス標準書との乖離分析と成約実績の相関分析 - 成約率が50%の場合、中間値として相関分析を実行する', () => {
    const salesPersonId = 'SALES_A_001';
    const analysisStartDate = '2024-01-01';
    const analysisEndDate = '2024-01-31';
    const totalDeals = 100;
    const closedDeals = 50;
    const lostDeals = 50;
    const closureRate = 0.5;

    const processStepsCompliance = [
      {
        stepId: 'STEP_001',
        stepName: '初回接触',
        completionRate: 0.95,
      },
      {
        stepId: 'STEP_002',
        stepName: '提案',
        completionRate: 0.88,
      },
      {
        stepId: 'STEP_003',
        stepName: '交渉',
        completionRate: 0.72,
      },
      {
        stepId: 'STEP_004',
        stepName: '合意',
        completionRate: 0.65,
      },
      {
        stepId: 'STEP_005',
        stepName: '成約',
        completionRate: 0.50,
      },
    ];

    const standardProcessSteps = [
      {
        stepId: 'STEP_001',
        stepName: '初回接触',
        standardCompletionRate: 1.0,
      },
      {
        stepId: 'STEP_002',
        stepName: '提案',
        standardCompletionRate: 1.0,
      },
      {
        stepId: 'STEP_003',
        stepName: '交渉',
        standardCompletionRate: 1.0,
      },
      {
        stepId: 'STEP_004',
        stepName: '合意',
        standardCompletionRate: 1.0,
      },
      {
        stepId: 'STEP_005',
        stepName: '成約',
        standardCompletionRate: 1.0,
      },
    ];

    const closedDealData = Array.from({ length: closedDeals }, (_, i) => ({
      dealId: `DEAL_CLOSED_${String(i + 1).padStart(3, '0')}`,
      closureStatus: 'closed',
      dealValue: 1000000,
    }));

    const lostDealData = Array.from({ length: lostDeals }, (_, i) => ({
      dealId: `DEAL_LOST_${String(i + 1).padStart(3, '0')}`,
      closureStatus: 'lost',
      dealValue: 1000000,
    }));

    const allDealData = [...closedDealData, ...lostDealData];

    const analysisInput = {
      salesPersonId,
      analysisStartDate,
      analysisEndDate,
      processStepsCompliance,
      standardProcessSteps,
      dealData: allDealData,
      closureRate,
    };

    const result = analyzeProcessDeviationAndCorrelation(analysisInput);

    expect(result).toBeDefined();
    expect(result.salesPersonId).toBe(salesPersonId);
    expect(result.analysisStartDate).toBe(analysisStartDate);
    expect(result.analysisEndDate).toBe(analysisEndDate);

    expect(result.deviationAnalysis).toBeDefined();
    expect(result.deviationAnalysis.deviationItems).toHaveLength(5);

    const step005Deviation = result.deviationAnalysis.deviationItems.find(
      (item) => item.stepId === 'STEP_005'
    );
    expect(step005Deviation).toBeDefined();
    expect(step005Deviation?.deviationPercentage).toBe(0.5);

    expect(result.correlationAnalysis).toBeDefined();
    expect(result.correlationAnalysis.isExecuted).toBe(true);
    expect(result.correlationAnalysis.executionReason).toBe('中間値検出（成約率50%）');

    expect(result.correlationAnalysis.correlationCoefficient).toBeGreaterThanOrEqual(-1.0);
    expect(result.correlationAnalysis.correlationCoefficient).toBeLessThanOrEqual(1.0);

    expect(result.analysisAuditLog).toBeDefined();
    expect(result.analysisAuditLog.targetPeriod).toBe('2024-01-01_2024-01-31');
    expect(result.analysisAuditLog.sampleSize).toBe(100);

    expect(result.analysisAuditLog.deviationItemsUsed).toHaveLength(5);
    expect(result.analysisAuditLog.deviationItemsUsed).toEqual([
      'STEP_001',
      'STEP_002',
      'STEP_003',
      'STEP_004',
      'STEP_005',
    ]);

    expect(result.analysisAuditLog.correlationDatasetSize).toBe(100);
    expect(result.analysisAuditLog.closedDealsInDataset).toBe(50);
    expect(result.analysisAuditLog.lostDealsInDataset).toBe(50);

    expect(result.analysisAuditLog.correlationFormula).toBe('Pearson');
    expect(result.analysisAuditLog.variablesUsed).toEqual([
      'processDeviation',
      'closureOutcome',
    ]);

    expect(result.analysisAuditLog.executionTimestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
    );

    expect(result.auditTrail).toBeDefined();
    expect(result.auditTrail.analysisId).toBeDefined();
    expect(result.auditTrail.analysisId).toMatch(/^ANALYSIS_[0-9A-F]{8}$/);
  });
});