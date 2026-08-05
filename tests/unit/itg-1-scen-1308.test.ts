import { runTx12Imp1Agent } from '../../src/logic/it-1';

// Mock AI client interface
interface Tx12Imp1AiClient {
  extractMonthlyData: jest.Mock;
  performQualityCheck: jest.Mock;
  analyzeActionPatterns: jest.Mock;
  detectProcessDeviation: jest.Mock;
  analyzeAcquisitionCorrelation: jest.Mock;
  generateImprovementProposals: jest.Mock;
}

// Mock orchestrator logger
interface OrchestratorLog {
  eventType: string;
  timestamp: Date;
  actionIndex: number;
  details: Record<string, unknown>;
}

describe('営業プロセス実行状況の監査ダッシュボード - Tx12Imp1Agent', () => {
  let mockAiClient: Tx12Imp1AiClient;
  let orchestratorLogs: OrchestratorLog[];

  beforeEach(() => {
    orchestratorLogs = [];

    mockAiClient = {
      extractMonthlyData: jest.fn().mockResolvedValue({
        recordCount: 250,
        dateRange: {
          startDate: '2024-01-01',
          endDate: '2024-01-31',
        },
        data: Array(250).fill(null).map((_, idx) => ({
          id: `sales_record_${idx}`,
          salesPersonId: `sp_${idx % 10}`,
          contactDate: new Date('2024-01-15'),
          proposalCount: Math.floor(Math.random() * 3) + 1,
        })),
      }),
      performQualityCheck: jest.fn().mockResolvedValue({
        qualityScore: 98,
        missingValuesPercentage: 0.5,
        formatErrors: 0,
        duplicateCount: 0,
        passedThreshold: true,
      }),
      analyzeActionPatterns: jest.fn().mockResolvedValue({
        salesPersonCount: 10,
        averageContactFrequency: 8.2,
        detectedProposalPatterns: 3,
        averageFollowUpInterval: 3.1,
        patterns: [
          {
            salesPersonId: 'sp_0',
            contactFrequency: 8.2,
            proposalPatterns: 3,
            followUpIntervalDays: 3.1,
          },
          {
            salesPersonId: 'sp_1',
            contactFrequency: 7.9,
            proposalPatterns: 2,
            followUpIntervalDays: 3.5,
          },
        ],
      }),
      detectProcessDeviation: jest.fn().mockResolvedValue({
        standardProcessSteps: 5,
        deviationCount: 2,
        deviations: [
          {
            stepName: '初期接触',
            completionRate: 89,
            expectedRate: 95,
          },
          {
            stepName: 'クロージング',
            exceedingRecords: 3,
            metric: '提案期間超過',
          },
        ],
      }),
      analyzeAcquisitionCorrelation: jest.fn().mockResolvedValue({
        monthlyContractCount: 18,
        contractRate: 42.8,
        correlations: [
          {
            pattern: '接触頻度高',
            contractRate: 48.3,
            correlationCoefficient: 0.78,
          },
          {
            pattern: 'フォローアップ短',
            contractRate: 51.2,
            correlationCoefficient: 0.82,
          },
          {
            pattern: '複数提案パターン',
            contractRate: 45.7,
            correlationCoefficient: 0.71,
          },
        ],
      }),
      generateImprovementProposals: jest.fn().mockResolvedValue({
        processModifications: [
          {
            id: 'pm_1',
            description: '初期接触プロセスの標準化',
            priority: 'high',
          },
          {
            id: 'pm_2',
            description: '提案期間ガイドラインを5営業日以内に短縮',
            priority: 'high',
          },
          {
            id: 'pm_3',
            description: '高頻度接触+短間隔フォローアップパターンの全社展開',
            priority: 'medium',
          },
          {
            id: 'pm_4',
            description: 'リード獲得プロセスの強化',
            priority: 'medium',
          },
        ],
        targetedCoachingRecipients: [
          { salesPersonId: 'sp_0', reason: 'プロセス遵守率低下' },
          { salesPersonId: 'sp_1', reason: 'フォローアップ間隔改善必要' },
          { salesPersonId: 'sp_2', reason: '提案精度向上機会' },
        ],
      }),
    };
  });

  // SCEN-1308: [normal] 営業データ分析から乖離検出までの自律実行 AIエージェント
  test('should complete end-to-end sales process analysis autonomously without interim human approval', async () => {
    const triggerEvent = {
      eventType: 'monthly_meeting_trigger',
      meetingId: 'MTG-2024-01-001',
      scheduledDateTime: new Date('2024-01-01T09:00:00Z'),
    };

    const startTime = new Date('2024-01-01T09:00:00Z');

    const result = await runTx12Imp1Agent(
      triggerEvent,
      mockAiClient as unknown as Tx12Imp1AiClient,
      (log: OrchestratorLog) => {
        orchestratorLogs.push(log);
      }
    );

    // Step 1: Verify trigger confirmation was captured
    expect(orchestratorLogs).toContainEqual(
      expect.objectContaining({
        eventType: 'action_started',
        actionIndex: 0,
        details: expect.objectContaining({
          actionName: 'trigger_confirmation',
          meetingId: 'MTG-2024-01-001',
        }),
      })
    );

    // Step 2: Verify data extraction from database
    expect(mockAiClient.extractMonthlyData).toHaveBeenCalledWith(
      '2024-01-01',
      '2024-01-31'
    );
    expect(orchestratorLogs).toContainEqual(
      expect.objectContaining({
        eventType: 'action_completed',
        actionIndex: 1,
        details: expect.objectContaining({
          actionName: 'extract_monthly_data',
          recordCount: 250,
        }),
      })
    );

    // Step 3: Verify quality check execution
    expect(mockAiClient.performQualityCheck).toHaveBeenCalled();
    const qualityCheckLog = orchestratorLogs.find(
      (log) =>
        log.details.actionName === 'perform_quality_check' &&
        log.eventType === 'action_completed'
    );
    expect(qualityCheckLog).toBeDefined();
    expect(qualityCheckLog?.details).toMatchObject({
      qualityScore: 98,
      missingValuesPercentage: 0.5,
      formatErrors: 0,
      duplicateCount: 0,
      passedThreshold: true,
    });
    expect(qualityCheckLog?.details.qualityScore).toBeGreaterThanOrEqual(95);

    // Step 4: Verify action pattern analysis
    expect(mockAiClient.analyzeActionPatterns).toHaveBeenCalled();
    const actionPatternLog = orchestratorLogs.find(
      (log) =>
        log.details.actionName === 'analyze_action_patterns' &&
        log.eventType === 'action_completed'
    );
    expect(actionPatternLog).toBeDefined();
    expect(actionPatternLog?.details).toMatchObject({
      salesPersonCount: 10,
      averageContactFrequency: 8.2,
      detectedProposalPatterns: 3,
      averageFollowUpInterval: 3.1,
    });

    // Step 5: Verify process deviation detection
    expect(mockAiClient.detectProcessDeviation).toHaveBeenCalled();
    const deviationLog = orchestratorLogs.find(
      (log) =>
        log.details.actionName === 'detect_process_deviation' &&
        log.eventType === 'action_completed'
    );
    expect(deviationLog).toBeDefined();
    expect(deviationLog?.details).toMatchObject({
      standardProcessSteps: 5,
      deviationCount: 2,
    });
    const deviations = deviationLog?.details.deviations as Array<{
      stepName: string;
      completionRate?: number;
    }>;
    expect(deviations).toContainEqual(
      expect.objectContaining({
        stepName: '初期接触',
        completionRate: 89,
      })
    );

    // Step 6: Verify acquisition correlation analysis
    expect(mockAiClient.analyzeAcquisitionCorrelation).toHaveBeenCalled();
    const correlationLog = orchestratorLogs.find(
      (log) =>
        log.details.actionName === 'analyze_acquisition_correlation' &&
        log.eventType === 'action_completed'
    );
    expect(correlationLog).toBeDefined();
    expect(correlationLog?.details).toMatchObject({
      monthlyContractCount: 18,
      contractRate: 42.8,
    });
    const correlations = correlationLog?.details.correlations as Array<{
      pattern: string;
      contractRate: number;
      correlationCoefficient: number;
    }>;
    expect(correlations).toContainEqual(
      expect.objectContaining({
        pattern: '接触頻度高',
        contractRate: 48.3,
        correlationCoefficient: 0.78,
      })
    );
    expect(correlations).toContainEqual(
      expect.objectContaining({
        pattern: 'フォローアップ短',
        contractRate: 51.2,
        correlationCoefficient: 0.82,
      })
    );
    expect(correlations).toContainEqual(
      expect.objectContaining({
        pattern: '複数提案パターン',
        contractRate: 45.7,
        correlationCoefficient: 0.71,
      })
    );

    // Step 7: Verify improvement proposal generation
    expect(mockAiClient.generateImprovementProposals).toHaveBeBeenCalled();
    const proposalLog = orchestratorLogs.find(
      (log) =>
        log.details.actionName === 'generate_improvement_proposals' &&
        log.eventType === 'action_completed'
    );
    expect(proposalLog).toBeDefined();

    const proposalModifications = proposalLog?.details
      .processModifications as Array<{ description: string; priority: string }>;
    expect(proposalModifications).toContainEqual(
      expect.objectContaining({
        description: '初期接触プロセスの標準化',
        priority: 'high',
      })
    );
    expect(proposalModifications).toContainEqual(
      expect.objectContaining({
        description: '提案期間ガイドラインを5営業日以内に短縮',
        priority: 'high',
      })
    );
    expect(proposalModifications).toContainEqual(
      expect.objectContaining({
        description: '高頻度接触+短間隔フォローアップパターンの全社展開',
        priority: 'medium',
      })
    );

    const targetedCoachingRecipients = proposalLog?.details
      .targetedCoachingRecipients as Array<{ salesPersonId: string }>;
    expect(targetedCoachingRecipients).toHaveLength(3);
    expect(targetedCoachingRecipients.map((r) => r.salesPersonId)).toEqual([
      'sp_0',
      'sp_1',
      'sp_2',
    ]);

    // Verify verification information is recorded
    expect(result).toMatchObject({
      reportId: expect.any(String),
      status: 'review_awaiting',
      verificationInfo: expect.objectContaining({
        datasetRange: {
          startDate: '2024-01-01',
          endDate: '2024-01-31',
        },
        dataRecordCount: 250,
        missingValueRatio: 0.5,
        calculationLogic: expect.objectContaining({
          correlationMethod: 'pearson_coefficient',
          processAdherenceFormula: expect.any(String),
        }),
      }),
    });

    // Verify report presentation to manager
    const presentationLog = orchestratorLogs.find(
      (log) =>
        log.details.actionName === 'present_report_to_manager' &&
        log.eventType === 'action_completed'
    );
    expect(presentationLog).toBeDefined();
    expect(presentationLog?.details).toMatchObject({
      status: 'review_awaiting',
      reportId: expect.any(String),
    });

    // Verify all 7 actions executed in sequence
    const completedActions = orchestratorLogs.filter(
      (log) => log.eventType === 'action_completed'
    );
    expect(completedActions).toHaveLength(7);
    expect(completedActions.map((log) => log.actionIndex)).toEqual([
      0, 1, 2, 3, 4, 5, 6,
    ]);

    // Verify completion event
    const completionLog = orchestratorLogs.find(
      (log) => log.eventType === 'tx_12_imp_1_completed'
    );
    expect(completionLog).toBeDefined();

    // Verify report generation time
    const completionTime = new Date(
      completionLog?.timestamp || new Date()
    );
    const elapsedMinutes =
      (completionTime.getTime() - startTime.getTime()) / (1000 * 60);
    expect(elapsedMinutes).toBeLessThanOrEqual(60);

    // Verify no interim human approval was required
    const approvalRequests = orchestratorLogs.filter(
      (log) =>
        log.eventType === 'escalation_triggered' ||
        log.details.requiresHumanApproval === true
    );
    expect(approvalRequests).toHaveLength(0);

    // Verify autonomous execution to completion
    expect(result).toMatchObject({
      reportId: expect.any(String),
      status: 'review_awaiting',
      autonomouslyCompleted: true,
      allActionsExecuted: true,
      executionTimeMinutes: expect.any(Number),
    });
    expect(result.executionTimeMinutes).toBeLessThanOrEqual(60);
  });
});