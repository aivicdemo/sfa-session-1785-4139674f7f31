import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx12Imp1Agent } from '../../src/agents/tx-12-imp-1/orchestrator';
import type { Tx12Imp1AiClient } from '../../src/agents/tx-12-imp-1/ai-client';

describe('営業プロセス標準書との乖離分析と成約実績の相関分析機能', () => {
  let mockAiClient: Tx12Imp1AiClient;
  let auditLogRecords: Array<{
    timestamp: string;
    action: string;
    dataset: Record<string, unknown>;
    logic: Record<string, unknown>;
  }>;

  beforeEach(() => {
    auditLogRecords = [];

    // Mock AI client implementation
    mockAiClient = {
      extractSalesActivityLogs: async (input: {
        startDate: string;
        endDate: string;
        targetSalesRepId?: string;
      }) => {
        // SCEN-1215: Mock sales activity logs spanning January 15 - February 15, 2024
        const logs = [
          // January 15-31: 10 logs for Sales Rep A
          {
            logId: 'log_001',
            salesRepId: 'rep_a',
            logDate: '2024-01-15',
            step: 'initial_contact',
            stepCode: 'INIT',
          },
          {
            logId: 'log_002',
            salesRepId: 'rep_a',
            logDate: '2024-01-17',
            step: 'proposal',
            stepCode: 'PROP',
          },
          {
            logId: 'log_003',
            salesRepId: 'rep_a',
            logDate: '2024-01-19',
            step: 'followup',
            stepCode: 'FUP',
          },
          {
            logId: 'log_004',
            salesRepId: 'rep_a',
            logDate: '2024-01-22',
            step: 'contract',
            stepCode: 'CNT',
          },
          {
            logId: 'log_005',
            salesRepId: 'rep_a',
            logDate: '2024-01-23',
            step: 'initial_contact',
            stepCode: 'INIT',
          },
          {
            logId: 'log_006',
            salesRepId: 'rep_a',
            logDate: '2024-01-24',
            step: 'proposal',
            stepCode: 'PROP',
          },
          {
            logId: 'log_007',
            salesRepId: 'rep_a',
            logDate: '2024-01-25',
            step: 'followup',
            stepCode: 'FUP',
          },
          {
            logId: 'log_008',
            salesRepId: 'rep_a',
            logDate: '2024-01-26',
            step: 'initial_contact',
            stepCode: 'INIT',
          },
          {
            logId: 'log_009',
            salesRepId: 'rep_a',
            logDate: '2024-01-29',
            step: 'proposal',
            stepCode: 'PROP',
          },
          {
            logId: 'log_010',
            salesRepId: 'rep_a',
            logDate: '2024-01-31',
            step: 'contract',
            stepCode: 'CNT',
          },
          // February 1-15: 8 logs for Sales Rep A
          {
            logId: 'log_011',
            salesRepId: 'rep_a',
            logDate: '2024-02-01',
            step: 'followup',
            stepCode: 'FUP',
          },
          {
            logId: 'log_012',
            salesRepId: 'rep_a',
            logDate: '2024-02-03',
            step: 'initial_contact',
            stepCode: 'INIT',
          },
          {
            logId: 'log_013',
            salesRepId: 'rep_a',
            logDate: '2024-02-05',
            step: 'proposal',
            stepCode: 'PROP',
          },
          {
            logId: 'log_014',
            salesRepId: 'rep_a',
            logDate: '2024-02-07',
            step: 'followup',
            stepCode: 'FUP',
          },
          {
            logId: 'log_015',
            salesRepId: 'rep_a',
            logDate: '2024-02-09',
            step: 'contract',
            stepCode: 'CNT',
          },
          {
            logId: 'log_016',
            salesRepId: 'rep_a',
            logDate: '2024-02-11',
            step: 'initial_contact',
            stepCode: 'INIT',
          },
          {
            logId: 'log_017',
            salesRepId: 'rep_a',
            logDate: '2024-02-13',
            step: 'proposal',
            stepCode: 'PROP',
          },
          {
            logId: 'log_018',
            salesRepId: 'rep_a',
            logDate: '2024-02-15',
            step: 'followup',
            stepCode: 'FUP',
          },
        ];

        // Record audit log for dataset extraction
        auditLogRecords.push({
          timestamp: new Date().toISOString(),
          action: 'extract_sales_activity_logs',
          dataset: {
            extractionPeriod: `${input.startDate} to ${input.endDate}`,
            targetSalesRepId: input.targetSalesRepId || 'all',
            totalRecordsExtracted: logs.length,
            filterCondition: 'logDate >= startDate AND logDate <= endDate',
          },
          logic: {
            datePeriodJudgment: 'BETWEEN filter on logDate column',
            monthCrossing: 'Date range spans multiple calendar months (Jan->Feb)',
          },
        });

        return logs;
      },

      validateDataQuality: async (input: {
        logs: Array<Record<string, unknown>>;
      }) => {
        return {
          qualityScore: 98,
          missingValuesDetected: 0,
          formatErrorsDetected: 0,
          duplicatesDetected: 0,
          status: 'pass',
        };
      },

      analyzeActionPatterns: async (input: {
        logs: Array<Record<string, unknown>>;
        salesRepId: string;
      }) => {
        // Analyze action patterns by step
        const stepCounts: Record<string, number> = {
          initial_contact: 0,
          proposal: 0,
          followup: 0,
          contract: 0,
        };

        input.logs.forEach((log: Record<string, unknown>) => {
          const step = log.step as string;
          if (step in stepCounts) {
            stepCounts[step]++;
          }
        });

        return {
          salesRepId: input.salesRepId,
          totalLogs: input.logs.length,
          stepBreakdown: stepCounts,
          actionPatterns: [
            { pattern: 'initial_contact -> proposal', frequency: 3 },
            { pattern: 'proposal -> followup', frequency: 4 },
            { pattern: 'followup -> contract', frequency: 2 },
          ],
        };
      },

      detectProcessDeviation: async (input: {
        actionPatterns: Record<string, unknown>;
        standardProcess: Record<string, unknown>;
      }) => {
        return {
          deviationDetected: false,
          deviationRatio: 0.05,
          deviationAreas: [],
        };
      },

      correlateWithContractResults: async (input: {
        actionPatterns: Record<string, unknown>;
        contractResults: Array<Record<string, unknown>>;
      }) => {
        return {
          correlationScore: 0.78,
          successPatterns: [
            {
              pattern: 'high_followup_frequency',
              successRate: 0.65,
            },
          ],
          recommendations: [
            'Increase followup frequency in initial_contact phase',
          ],
        };
      },

      generateAnalysisReport: async (input: {
        analysisResults: Record<string, unknown>;
      }) => {
        // Record audit log for calculation logic
        auditLogRecords.push({
          timestamp: new Date().toISOString(),
          action: 'generate_analysis_report',
          dataset: {
            analysisResultsReceived: true,
          },
          logic: {
            stepClassificationRule: 'JOIN with step master on stepCode',
            monthCrossingLogic:
              'Partition logs by MONTH(logDate) to derive monthly breakdown',
            aggregationLogic: 'COUNT(logId) GROUP BY salesRepId, step, MONTH',
          },
        });

        return {
          reportId: 'rpt_20240215_001',
          generatedAt: '2024-02-15T11:00:00Z',
          analysisResults: input.analysisResults,
          improvementProposals: [],
        };
      },
    };
  });

  afterEach(() => {
    auditLogRecords = [];
  });

  // SCEN-1215: [edge] 営業プロセス標準書との乖離分析と成約実績の相関分析機能 - 分析対象期間が月をまたぐときに営業活動ログが正確に集計される
  test('should accurately aggregate sales activity logs spanning across multiple months (Jan 15 - Feb 15 2024)', async () => {
    // Setup: Analysis period spanning January 15 - February 15, 2024
    const analysisStartDate = '2024-01-15';
    const analysisEndDate = '2024-02-15';
    const targetSalesRepId = 'rep_a';

    // Execute: Call runTx12Imp1Agent
    const result = await runTx12Imp1Agent(
      {
        startDate: analysisStartDate,
        endDate: analysisEndDate,
        targetSalesRepId: targetSalesRepId,
      },
      mockAiClient
    );

    // Verify: Total log count for Sales Rep A = 18 (10 in Jan + 8 in Feb)
    expect(result.analysisResults.totalLogsAggregated).toBe(18);

    // Verify: Monthly breakdown
    // January 15-31: 10 logs
    // February 1-15: 8 logs
    expect(result.analysisResults.monthlyBreakdown).toEqual({
      '2024-01': 10,
      '2024-02': 8,
    });

    // Verify: Step-wise breakdown
    // initial_contact: 4 logs (log_001, log_005, log_008, log_012, log_016) = 5
    // proposal: 5 logs (log_002, log_006, log_009, log_013, log_017) = 5
    // followup: 5 logs (log_003, log_007, log_011, log_014, log_018) = 5
    // contract: 3 logs (log_004, log_010, log_015) = 3
    expect(result.analysisResults.stepBreakdown).toEqual({
      initial_contact: 5,
      proposal: 5,
      followup: 5,
      contract: 3,
    });

    // Verify: Audit log records dataset extraction
    const extractionAuditLog = auditLogRecords.find(
      (log) => log.action === 'extract_sales_activity_logs'
    );
    expect(extractionAuditLog).toBeDefined();
    expect(extractionAuditLog?.dataset.extractionPeriod).toBe(
      '2024-01-15 to 2024-02-15'
    );
    expect(extractionAuditLog?.dataset.totalRecordsExtracted).toBe(18);
    expect(extractionAuditLog?.dataset.filterCondition).toContain('logDate');
    expect(extractionAuditLog?.dataset.filterCondition).toContain('startDate');
    expect(extractionAuditLog?.dataset.filterCondition).toContain('endDate');

    // Verify: Audit log records calculation logic - month-crossing judgment
    expect(extractionAuditLog?.logic.datePeriodJudgment).toContain('BETWEEN');
    expect(extractionAuditLog?.logic.monthCrossing).toContain('Jan');
    expect(extractionAuditLog?.logic.monthCrossing).toContain('Feb');

    // Verify: Audit log records calculation logic - step classification rule
    const reportGenerationAuditLog = auditLogRecords.find(
      (log) => log.action === 'generate_analysis_report'
    );
    expect(reportGenerationAuditLog).toBeDefined();
    expect(reportGenerationAuditLog?.logic.stepClassificationRule).toContain(
      'JOIN'
    );
    expect(reportGenerationAuditLog?.logic.stepClassificationRule).toContain(
      'stepCode'
    );

    // Verify: Audit log records calculation logic - month-crossing aggregation logic
    expect(reportGenerationAuditLog?.logic.monthCrossingLogic).toContain(
      'MONTH'
    );
    expect(reportGenerationAuditLog?.logic.monthCrossingLogic).toContain(
      'monthly breakdown'
    );

    // Verify: Audit log records calculation logic - aggregation function
    expect(reportGenerationAuditLog?.logic.aggregationLogic).toContain('COUNT');
    expect(reportGenerationAuditLog?.logic.aggregationLogic).toContain('GROUP');

    // Verify: Sales manager can verify based on audit log dataset
    const verificationDataset = extractionAuditLog?.dataset;
    expect(verificationDataset).toBeDefined();
    expect(verificationDataset?.totalRecordsExtracted).toBe(18);
    expect(verificationDataset?.extractionPeriod).toBe(
      '2024-01-15 to 2024-02-15'
    );

    // Verify: Report generation timestamp is recorded
    expect(result.reportGeneratedAt).toBe('2024-02-15T11:00:00Z');

    // Verify: Analysis results are consistent with input parameters
    expect(result.analysisStartDate).toBe('2024-01-15');
    expect(result.analysisEndDate).toBe('2024-02-15');
    expect(result.targetSalesRepId).toBe('rep_a');
  });
});