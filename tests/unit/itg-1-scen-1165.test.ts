import { correlateProcessStepsWithConversionRate } from '../../src/logic/it-1-br-2-1-1';

interface ProcessStep {
  stepId: string;
  stepName: string;
  executionDegree: number;
}

interface SalesCase {
  caseId: string;
  processSteps: ProcessStep[];
  conversionResult: boolean;
}

interface CorrelationAnalysisResult {
  correlations: Array<{
    stepId: string;
    stepName: string;
    correlationCoefficient: number;
    pValue: number;
  }>;
  datasetMetadata: {
    totalCases: number;
    analysisPeriod: string;
    caseIds: string[];
    excludedCaseCount: number;
  };
  calculationMetadata: {
    method: string;
    sampleSize: number;
    excludeConditions: string[];
  };
  executedAt: string;
  highestCorrelationStep: {
    stepId: string;
    correlationCoefficient: number;
  };
  lowestCorrelationStep: {
    stepId: string;
    correlationCoefficient: number;
  };
  correlationDifference: number;
  auditLogId: string;
}

describe('営業プロセス標準書ステップと成約率の相関分析', () => {
  // SCEN-1165
  test('成約実績との相関分析 - 営業プロセス標準書の各ステップ実行度と成約率の相関係数が正常に計算される', async () => {
    // テストデータ準備：営業プロセス標準書の5ステップ定義
    const processStepDefinitions = [
      { stepId: 'step_001', stepName: '初期接触' },
      { stepId: 'step_002', stepName: 'ニーズ把握' },
      { stepId: 'step_003', stepName: '提案' },
      { stepId: 'step_004', stepName: '折衝' },
      { stepId: 'step_005', stepName: 'クロージング' }
    ];

    // 過去6ヶ月分の営業実績データ（30件以上）
    // 各ケースにステップ実行度と成約結果を含める
    const salesCasesData: SalesCase[] = [
      {
        caseId: 'case_001',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 95 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 92 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 88 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 85 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 90 }
        ],
        conversionResult: true
      },
      {
        caseId: 'case_002',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 87 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 90 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 92 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 88 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 85 }
        ],
        conversionResult: true
      },
      {
        caseId: 'case_003',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 75 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 70 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 65 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 72 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 68 }
        ],
        conversionResult: false
      },
      {
        caseId: 'case_004',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 92 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 88 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 85 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 90 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 92 }
        ],
        conversionResult: true
      },
      {
        caseId: 'case_005',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 68 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 62 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 58 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 65 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 60 }
        ],
        conversionResult: false
      },
      {
        caseId: 'case_006',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 90 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 85 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 88 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 82 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 88 }
        ],
        conversionResult: true
      },
      {
        caseId: 'case_007',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 78 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 75 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 72 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 70 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 75 }
        ],
        conversionResult: false
      },
      {
        caseId: 'case_008',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 93 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 91 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 89 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 87 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 91 }
        ],
        conversionResult: true
      },
      {
        caseId: 'case_009',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 72 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 68 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 70 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 66 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 65 }
        ],
        conversionResult: false
      },
      {
        caseId: 'case_010',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 88 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 86 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 84 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 83 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 86 }
        ],
        conversionResult: true
      },
      {
        caseId: 'case_011',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 65 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 60 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 62 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 58 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 55 }
        ],
        conversionResult: false
      },
      {
        caseId: 'case_012',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 91 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 89 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 87 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 86 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 89 }
        ],
        conversionResult: true
      },
      {
        caseId: 'case_013',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 76 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 73 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 74 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 71 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 72 }
        ],
        conversionResult: false
      },
      {
        caseId: 'case_014',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 94 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 92 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 90 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 88 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 92 }
        ],
        conversionResult: true
      },
      {
        caseId: 'case_015',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 70 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 65 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 67 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 63 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 62 }
        ],
        conversionResult: false
      },
      {
        caseId: 'case_016',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 89 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 87 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 86 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 84 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 87 }
        ],
        conversionResult: true
      },
      {
        caseId: 'case_017',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 74 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 71 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 69 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 68 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 70 }
        ],
        conversionResult: false
      },
      {
        caseId: 'case_018',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 96 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 94 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 92 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 91 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 94 }
        ],
        conversionResult: true
      },
      {
        caseId: 'case_019',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 69 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 64 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 61 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 60 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 58 }
        ],
        conversionResult: false
      },
      {
        caseId: 'case_020',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 86 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 84 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 82 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 81 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 84 }
        ],
        conversionResult: true
      },
      {
        caseId: 'case_021',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 77 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 74 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 76 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 73 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 74 }
        ],
        conversionResult: false
      },
      {
        caseId: 'case_022',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 92 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 90 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 88 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 86 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 90 }
        ],
        conversionResult: true
      },
      {
        caseId: 'case_023',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 73 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 69 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 71 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 67 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 68 }
        ],
        conversionResult: false
      },
      {
        caseId: 'case_024',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 95 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 93 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 91 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 89 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 93 }
        ],
        conversionResult: true
      },
      {
        caseId: 'case_025',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 71 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 67 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 64 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 62 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 61 }
        ],
        conversionResult: false
      },
      {
        caseId: 'case_026',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 87 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 85 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 83 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 82 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 85 }
        ],
        conversionResult: true
      },
      {
        caseId: 'case_027',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 79 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 76 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 78 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 75 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 76 }
        ],
        conversionResult: false
      },
      {
        caseId: 'case_028',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 98 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 96 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 94 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 92 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 96 }
        ],
        conversionResult: true
      },
      {
        caseId: 'case_029',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 68 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 63 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 59 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 57 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 56 }
        ],
        conversionResult: false
      },
      {
        caseId: 'case_030',
        processSteps: [
          { stepId: 'step_001', stepName: '初期接触', executionDegree: 84 },
          { stepId: 'step_002', stepName: 'ニーズ把握', executionDegree: 82 },
          { stepId: 'step_003', stepName: '提案', executionDegree: 80 },
          { stepId: 'step_004', stepName: '折衝', executionDegree: 79 },
          { stepId: 'step_005', stepName: 'クロージング', executionDegree: 82 }
        ],
        conversionResult: true
      }
    ];

    // 分析期間：過去6ヶ月
    const analysisPeriodStart = '2024-01-01T00:00:00Z';
    const analysisPeriodEnd = '2024-06-30T23:59:59Z';
    const executionTimestamp = '2024-07-01T10:00:00Z';

    // 関数呼び出し
    const result: CorrelationAnalysisResult = await correlateProcessStepsWithConversionRate({
      processStepDefinitions,
      salesCasesData,
      analysisPeriodStart,
      analysisPeriodEnd,
      executedAt: executionTimestamp,
      executedByUserId: 'user_manager_001',
      executionContext: {
        triggerSource: 'monthly_sales_meeting',
        dataQualityCheckCompleted: true,
        dataQualityScore: 98
      }
    });

    // 検証1：相関係数が-1.0～1.0の範囲内であることを確認
    result.correlations.forEach((correlation) => {
      expect(correlation.correlationCoefficient).toBeGreaterThanOrEqual(-1.0);
      expect(correlation.correlationCoefficient).toBeLessThanOrEqual(1.0);
    });

    // 検証2：統計的有意性（p値 < 0.05）を確認
    result.correlations.forEach((correlation) => {
      expect(correlation.pValue).toBeLessThan(0.05);
    });

    // 検証3：最も相関の高いステップと最も低いステップの差分が0.3以上であることを確認
    const correlationDifference = Math.abs(
      result.highestCorrelationStep.correlationCoefficient -
      result.lowestCorrelationStep.correlationCoefficient
    );
    expect(correlationDifference).toBeGreaterThanOrEqual(0.3);
    expect(result.correlationDifference).toBeGreaterThanOrEqual(0.3);

    // 検証4：データセットメタデータが含まれていることを確認
    expect(result.datasetMetadata).toBeDefined();
    expect(result.datasetMetadata.totalCases).toBe(30);
    expect(result.datasetMetadata.analysisPeriod).toBe('2024-01-01 to 2024-06-30');
    expect(result.datasetMetadata.caseIds).toHaveLength(30);
    expect(result.datasetMetadata.caseIds).toContain('case_001');
    expect(result.datasetMetadata.caseIds).toContain('case_030');

    // 検証5：計算ロジック（ピアソン相関係数、標本数、除外条件）がメタデータに記録されていることを確認
    expect(result.calculationMetadata).toBeDefined();
    expect(result.calculationMetadata.method).toBe('Pearson correlation coefficient');
    expect(result.calculationMetadata.sampleSize).toBe(30);
    expect(result.calculationMetadata.excludeConditions).toContain('cases_with_missing_step_execution_data');

    // 検証6：タイムスタンプが現在時刻（±1秒以内）であることを確認
    const executedAtTime = new Date(result.executedAt).getTime();
    const expectedTime = new Date(executionTimestamp).getTime();
    const timeDifference = Math.abs(executedAtTime - expectedTime);
    expect(timeDifference).toBeLessThanOrEqual(1000); // 1秒以内

    // 検証7：監査ログIDが記録されていることを確認
    expect(result.auditLogId).toBeDefined();
    expect(result.auditLogId).toMatch(/^audit_log_\d{10,}/);

    // 検証8：相関分析結果に各ステップの相関係数が正常に格納されていることを確認
    expect(result.correlations).toHaveLength(5);
    expect(result.correlations.map((c) => c.stepId)).toEqual([
      'step_001',
      'step_002',
      'step_003',
      'step_004',
      'step_005'
    ]);

    // 検証9：最高相関と最低相関のステップ情報が正しく格納されていることを確認
    expect(result.highestCorrelationStep.stepId).toBeDefined();
    expect(result.highestCorrelationStep.correlationCoefficient).toBeGreaterThan(0);
    expect(result.lowestCorrelationStep.stepId).toBeDefined();
    expect(result.lowestCorrelationStep.correlationCoefficient).toBeLessThan(
      result.highestCorrelationStep.correlationCoefficient
    );

    // 検証10：相関係数が初期接触ステップで最も高い正の相関を示していることを確認（営業実績パターン的に）
    const initialContactCorrelation = result.correlations.find(
      (c) => c.stepId === 'step_001'
    );
    expect(initialContactCorrelation).toBeDefined();
    expect(initialContactCorrelation!.correlationCoefficient).toBeGreaterThan(0.6);
  });
});