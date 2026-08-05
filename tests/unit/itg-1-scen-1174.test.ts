import { runTx12Imp1Agent } from '../../src/agents/tx-12-imp-1/orchestrator';
import type { Tx12Imp1AiClient } from '../../src/agents/tx-12-imp-1/orchestrator';

// Mock AI client
const mockAiClient: Tx12Imp1AiClient = {
  analyzeCorrelation: jest.fn(),
};

describe('営業プロセス遵守状況と成約実績の相関分析', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1174
  test('成約実績との相関分析機能 - プロセスステップ実行度と成約率の負の相関が検出される場合、可視化データに負の相関値が含まれる', async () => {
    // テスト用の営業データセット準備
    const test_dataset_id = 'dataset_2024_jan_jun_005';
    const sales_rep_a = {
      salesRepId: 'rep_a',
      name: 'A',
      processComplianceRate: 92,
      closureRate: 28,
      contactFrequency: 45,
      proposalExecutionRate: 88,
      followupIntervalStdDev: 2.5,
      monthlyData: [
        {
          month: '2024-01',
          compliance_rate: 90,
          closure_rate: 30,
        },
        {
          month: '2024-02',
          compliance_rate: 93,
          closure_rate: 26,
        },
        {
          month: '2024-03',
          compliance_rate: 94,
          closure_rate: 31,
        },
        {
          month: '2024-04',
          compliance_rate: 91,
          closure_rate: 27,
        },
        {
          month: '2024-05',
          compliance_rate: 92,
          closure_rate: 29,
        },
        {
          month: '2024-06',
          compliance_rate: 93,
          closure_rate: 25,
        },
      ],
    };

    const sales_rep_b = {
      salesRepId: 'rep_b',
      name: 'B',
      processComplianceRate: 78,
      closureRate: 22,
      contactFrequency: 38,
      proposalExecutionRate: 72,
      followupIntervalStdDev: 5.1,
      monthlyData: [
        {
          month: '2024-01',
          compliance_rate: 76,
          closure_rate: 20,
        },
        {
          month: '2024-02',
          compliance_rate: 79,
          closure_rate: 23,
        },
        {
          month: '2024-03',
          compliance_rate: 78,
          closure_rate: 21,
        },
        {
          month: '2024-04',
          compliance_rate: 77,
          closure_rate: 22,
        },
        {
          month: '2024-05',
          compliance_rate: 80,
          closure_rate: 24,
        },
        {
          month: '2024-06',
          compliance_rate: 78,
          closure_rate: 22,
        },
      ],
    };

    const sales_rep_c = {
      salesRepId: 'rep_c',
      name: 'C',
      processComplianceRate: 85,
      closureRate: -25,
      contactFrequency: 51,
      proposalExecutionRate: 86,
      followupIntervalStdDev: 1.8,
      monthlyData: [
        {
          month: '2024-01',
          compliance_rate: 84,
          closure_rate: -24,
        },
        {
          month: '2024-02',
          compliance_rate: 86,
          closure_rate: -26,
        },
        {
          month: '2024-03',
          compliance_rate: 85,
          closure_rate: -25,
        },
        {
          month: '2024-04',
          compliance_rate: 85,
          closure_rate: -24,
        },
        {
          month: '2024-05',
          compliance_rate: 86,
          closure_rate: -26,
        },
        {
          month: '2024-06',
          compliance_rate: 85,
          closure_rate: -25,
        },
      ],
    };

    const sales_rep_d = {
      salesRepId: 'rep_d',
      name: 'D',
      processComplianceRate: 88,
      closureRate: 32,
      contactFrequency: 48,
      proposalExecutionRate: 85,
      followupIntervalStdDev: 3.2,
      monthlyData: [
        {
          month: '2024-01',
          compliance_rate: 87,
          closure_rate: 30,
        },
        {
          month: '2024-02',
          compliance_rate: 89,
          closure_rate: 33,
        },
        {
          month: '2024-03',
          compliance_rate: 88,
          closure_rate: 32,
        },
        {
          month: '2024-04',
          compliance_rate: 88,
          closure_rate: 31,
        },
        {
          month: '2024-05',
          compliance_rate: 89,
          closure_rate: 34,
        },
        {
          month: '2024-06',
          compliance_rate: 87,
          closure_rate: 31,
        },
      ],
    };

    const sales_rep_e = {
      salesRepId: 'rep_e',
      name: 'E',
      processComplianceRate: 81,
      closureRate: 19,
      contactFrequency: 42,
      proposalExecutionRate: 75,
      followupIntervalStdDev: 6.3,
      monthlyData: [
        {
          month: '2024-01',
          compliance_rate: 80,
          closure_rate: 18,
        },
        {
          month: '2024-02',
          compliance_rate: 82,
          closure_rate: 20,
        },
        {
          month: '2024-03',
          compliance_rate: 81,
          closure_rate: 19,
        },
        {
          month: '2024-04',
          compliance_rate: 80,
          closure_rate: 18,
        },
        {
          month: '2024-05',
          compliance_rate: 82,
          closure_rate: 21,
        },
        {
          month: '2024-06',
          compliance_rate: 81,
          closure_rate: 19,
        },
      ],
    };

    const test_sales_reps = [
      sales_rep_a,
      sales_rep_b,
      sales_rep_c,
      sales_rep_d,
      sales_rep_e,
    ];

    const mock_correlation_result = {
      correlationCoefficient: -0.72,
      correlationType: 'negative' as const,
      affectedSalesRepresentative: 'C',
      processComplianceRate: 85,
      closureRate: -25,
      datasetUsed: test_dataset_id,
      calculationLogic: 'pearson_correlation',
      pValue: 0.003,
      sampleSize: 30,
      confidenceLevel: 0.95,
    };

    // Mock AI client を設定
    (mockAiClient.analyzeCorrelation as jest.Mock).mockResolvedValue(
      mock_correlation_result
    );

    // runTx12Imp1Agent を実行
    const report_result = await runTx12Imp1Agent(
      {
        salesRepresentativesData: test_sales_reps,
        datasetId: test_dataset_id,
        analysisTriggeredBy: 'monthly_meeting',
        triggeredAt: new Date('2024-06-30T10:00:00Z'),
      },
      mockAiClient
    );

    // analyzeCorrelation が呼び出されたことを確認
    expect(mockAiClient.analyzeCorrelation).toHaveBeenCalled();

    // 可視化データが正しく格納されていることを確認
    expect(report_result.correlationAnalysisVisualization).toBeDefined();
    const viz_data = report_result.correlationAnalysisVisualization;

    expect(viz_data.correlationCoefficient).toBe(-0.72);
    expect(viz_data.correlationType).toBe('negative');
    expect(viz_data.affectedSalesRepresentative).toBe('C');
    expect(viz_data.processComplianceRate).toBe(85);
    expect(viz_data.closureRate).toBe(-25);
    expect(viz_data.datasetUsed).toBe(test_dataset_id);
    expect(viz_data.calculationLogic).toBe('pearson_correlation');

    // 監査ログイベントが記録されていることを確認
    expect(report_result.auditLog).toBeDefined();
    expect(report_result.auditLog).toHaveLength(1);

    const audit_event = report_result.auditLog[0];
    expect(audit_event.analysisType).toBe('成約相関分析');
    expect(audit_event.detectionResult).toBe('負の相関');
    expect(audit_event.correlationValue).toBe(-0.72);
    expect(audit_event.datasetId).toBe(test_dataset_id);
    expect(audit_event.calculationLogic).toBe('pearson_correlation');
    expect(audit_event.timestamp).toBeDefined();
  });
});