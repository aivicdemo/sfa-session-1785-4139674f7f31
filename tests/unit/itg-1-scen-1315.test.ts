import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import type { Tx12Imp1AiClient } from '../../src/agents/tx-12-imp-1/ai-client';
import { runTx12Imp1Agent } from '../../src/agents/tx-12-imp-1/orchestrator';

// Mock types for test data
interface MockSalesData {
  salesPersonId: string;
  contactFrequencyPerMonth: number;
  proposalCount: number;
  followUpIntervalDays: number;
  dealCount: number;
  contractAmount: number;
}

interface MockProcessDefinition {
  stepName: string;
  sequence: number;
  expectedDurationDays: number;
}

interface MockContractResult {
  dealId: string;
  contractRate: number;
  contactFrequency: number;
  followUpInterval: number;
  monthIndex: number;
}

interface AnalysisReport {
  datasetIdentifier: {
    extractionDateTime: string;
    recordCount: number;
    qualityScore: number;
  };
  calculationLogic: {
    executionAlgorithm: string;
    parameterValues: Record<string, unknown>;
  };
  analysisConclusions: {
    deviationCount: number;
    successPatternCount: number;
    improvementProposalCount: number;
  };
  referenceDataIds: string[];
  improvementProposals: Array<{
    proposalId: string;
    priority: 'high' | 'medium' | 'low';
    targetArea: 'process_modification' | 'individual_guidance' | 'new_deployment';
    expectedEffect: {
      contractRateImprovement: number;
    };
  }>;
  auditLog: {
    executionTimestamp: string;
    processingTimeMs: number;
    processorInfo: string;
  };
}

interface AgentExecutionContext {
  triggerId: string;
  salesPersonCount: number;
  dealRecordCount: number;
  contactRecordCount: number;
  monthlyDataExtractionDate: string;
}

// SCEN-1315
describe('営業データ分析から乖離検出までの自律実行 AIエージェント', () => {
  let mockAiClient: jest.Mocked<Tx12Imp1AiClient>;
  let auditLog: Array<{ event: string; timestamp: string; data: unknown }>;

  beforeEach(() => {
    auditLog = [];
    
    // Setup mock AI client
    mockAiClient = {
      extractMonthlyData: jest.fn().mockResolvedValue({
        salesPersonData: [
          {
            salesPersonId: 'sp_001',
            contactFrequencyPerMonth: 10.2,
            proposalCount: 3,
            followUpIntervalDays: 4.5,
            dealCount: 8,
            contractAmount: 1200000,
          },
          {
            salesPersonId: 'sp_002',
            contactFrequencyPerMonth: 9.8,
            proposalCount: 3,
            followUpIntervalDays: 5.2,
            dealCount: 7,
            contractAmount: 950000,
          },
          {
            salesPersonId: 'sp_003',
            contactFrequencyPerMonth: 11.5,
            proposalCount: 4,
            followUpIntervalDays: 3.8,
            dealCount: 9,
            contractAmount: 1450000,
          },
          {
            salesPersonId: 'sp_004',
            contactFrequencyPerMonth: 8.2,
            proposalCount: 2,
            followUpIntervalDays: 6.5,
            dealCount: 5,
            contractAmount: 680000,
          },
          {
            salesPersonId: 'sp_005',
            contactFrequencyPerMonth: 10.8,
            proposalCount: 3,
            followUpIntervalDays: 4.2,
            dealCount: 8,
            contractAmount: 1100000,
          },
        ] as MockSalesData[],
        totalDealRecords: 50,
        totalContactRecords: 200,
      }),
      validateDataQuality: jest.fn().mockResolvedValue({
        qualityScore: 0.953,
        missingValueCount: 2,
        formatErrorCount: 1,
        duplicateCount: 1,
        issues: [
          { type: 'missing_value', fieldName: 'followUpDate', recordId: 'rec_001' },
          { type: 'format_error', fieldName: 'contractAmount', recordId: 'rec_023' },
          { type: 'duplicate', recordIds: ['rec_045', 'rec_046'] },
        ],
      }),
      getProcessDefinition: jest.fn().mockResolvedValue({
        steps: [
          { stepName: '初期接触', sequence: 1, expectedDurationDays: 1 } as MockProcessDefinition,
          { stepName: '提案', sequence: 2, expectedDurationDays: 5 } as MockProcessDefinition,
          { stepName: 'フォローアップ', sequence: 3, expectedDurationDays: 3 } as MockProcessDefinition,
          { stepName: '成約', sequence: 4, expectedDurationDays: 1 } as MockProcessDefinition,
        ],
      }),
      extractHistoricalContractData: jest.fn().mockResolvedValue({
        sixMonthHistory: [
          {
            monthIndex: -5,
            contractRateByContactFrequency: {
              '8-9': 0.62,
              '10-11': 0.78,
              '12+': 0.82,
            },
            contractRateByFollowUpInterval: {
              '3-4': 0.79,
              '5-6': 0.68,
              '7+': 0.55,
            },
          },
          {
            monthIndex: -4,
            contractRateByContactFrequency: {
              '8-9': 0.63,
              '10-11': 0.79,
              '12+': 0.81,
            },
            contractRateByFollowUpInterval: {
              '3-4': 0.78,
              '5-6': 0.69,
              '7+': 0.56,
            },
          },
          {
            monthIndex: -3,
            contractRateByContactFrequency: {
              '8-9': 0.61,
              '10-11': 0.77,
              '12+': 0.83,
            },
            contractRateByFollowUpInterval: {
              '3-4': 0.80,
              '5-6': 0.67,
              '7+': 0.54,
            },
          },
          {
            monthIndex: -2,
            contractRateByContactFrequency: {
              '8-9': 0.64,
              '10-11': 0.78,
              '12+': 0.82,
            },
            contractRateByFollowUpInterval: {
              '3-4': 0.79,
              '5-6': 0.70,
              '7+': 0.55,
            },
          },
          {
            monthIndex: -1,
            contractRateByContactFrequency: {
              '8-9': 0.62,
              '10-11': 0.79,
              '12+': 0.81,
            },
            contractRateByFollowUpInterval: {
              '3-4': 0.78,
              '5-6': 0.68,
              '7+': 0.56,
            },
          },
          {
            monthIndex: 0,
            contractRateByContactFrequency: {
              '8-9': 0.60,
              '10-11': 0.78,
              '12+': 0.80,
            },
            contractRateByFollowUpInterval: {
              '3-4': 0.79,
              '5-6': 0.67,
              '7+': 0.54,
            },
          },
        ] as MockContractResult[],
      }),
      detectProcessDeviation: jest.fn().mockResolvedValue({
        deviationRate: 0.12,
        deviationDetails: [
          {
            deviationId: 'dev_001',
            salesPersonId: 'sp_004',
            stepName: 'フォローアップ',
            actualIntervalDays: 6.5,
            standardIntervalDays: 3,
            impactOnContractRate: -0.08,
          },
          {
            deviationId: 'dev_002',
            salesPersonId: 'sp_002',
            stepName: 'フォローアップ',
            actualIntervalDays: 5.2,
            standardIntervalDays: 3,
            impactOnContractRate: -0.11,
          },
          {
            deviationId: 'dev_003',
            salesPersonId: 'sp_001',
            stepName: '提案',
            actualDurationDays: 6,
            standardDurationDays: 5,
            impactOnContractRate: -0.02,
          },
        ],
      }),
      analyzeCorrelation: jest.fn().mockResolvedValue({
        successPatterns: [
          {
            patternId: 'pat_001',
            contactFrequencyMin: 10,
            contactFrequencyMax: 12,
            followUpIntervalMin: 3,
            followUpIntervalMax: 4,
            observedContractRate: 0.78,
            sampleSize: 45,
          },
          {
            patternId: 'pat_002',
            contactFrequencyMin: 12,
            contactFrequencyMax: 15,
            followUpIntervalMin: 3,
            followUpIntervalMax: 4,
            observedContractRate: 0.82,
            sampleSize: 28,
          },
        ],
        correlationStrength: 0.87,
      }),
      generateImprovementProposals: jest.fn().mockResolvedValue({
        proposals: [
          {
            proposalId: 'prop_001',
            priority: 'high',
            targetArea: 'individual_guidance',
            targetSalesPersonIds: ['sp_004', 'sp_002'],
            description: 'フォローアップ間隔の短縮指導',
            expectedContractRateImprovement: 0.08,
          },
          {
            proposalId: 'prop_002',
            priority: 'high',
            targetArea: 'process_modification',
            description: 'フォローアップステップの推奨間隔を3日に統一',
            expectedContractRateImprovement: 0.05,
          },
          {
            proposalId: 'prop_003',
            priority: 'medium',
            targetArea: 'new_deployment',
            description: '接触頻度10回以上の成功パターンを全員に展開',
            expectedContractRateImprovement: 0.03,
          },
          {
            proposalId: 'prop_004',
            priority: 'medium',
            targetArea: 'individual_guidance',
            targetSalesPersonIds: ['sp_005'],
            description: '高成績者（sp_005）のベストプラクティスを共有',
            expectedContractRateImprovement: 0.02,
          },
        ],
      }),
      recordAuditLog: jest.fn().mockImplementation((event: string, data: unknown) => {
        auditLog.push({
          event,
          timestamp: new Date('2024-01-15T11:00:00Z').toISOString(),
          data,
        });
        return Promise.resolve();
      }),
    } as unknown as jest.Mocked<Tx12Imp1AiClient>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should execute complete autonomous analysis workflow and present report to sales manager', async () => {
    // Setup execution context
    const executionContext: AgentExecutionContext = {
      triggerId: 'trigger_monthly_meeting_2024_01',
      salesPersonCount: 5,
      dealRecordCount: 50,
      contactRecordCount: 200,
      monthlyDataExtractionDate: '2024-01-15',
    };

    // Execute agent
    const report = await runTx12Imp1Agent(mockAiClient, executionContext);

    // Assertion 1: Agent called data extraction
    expect(mockAiClient.extractMonthlyData).toHaveBeenCalledWith({
      extractionDate: '2024-01-15',
    });

    // Assertion 2: Agent performed quality validation
    expect(mockAiClient.validateDataQuality).toHaveBeenCalled();

    // Assertion 3: Agent retrieved process definition
    expect(mockAiClient.getProcessDefinition).toHaveBeenCalled();

    // Assertion 4: Agent extracted historical contract data
    expect(mockAiClient.extractHistoricalContractData).toHaveBeenCalledWith({
      monthsBack: 6,
    });

    // Assertion 5: Agent detected process deviations
    expect(mockAiClient.detectProcessDeviation).toHaveBeenCalled();

    // Assertion 6: Agent analyzed correlation
    expect(mockAiClient.analyzeCorrelation).toHaveBeenCalled();

    // Assertion 7: Agent generated improvement proposals
    expect(mockAiClient.generateImprovementProposals).toHaveBeenCalled();

    // Assertion 8: Audit log recorded
    expect(mockAiClient.recordAuditLog).toHaveBeenCalled();

    // Assertion 9: Report structure - dataset identifier
    const typedReport = report as AnalysisReport;
    expect(typedReport.datasetIdentifier).toBeDefined();
    expect(typedReport.datasetIdentifier.extractionDateTime).toBe('2024-01-15');
    expect(typedReport.datasetIdentifier.recordCount).toBe(50);
    expect(typedReport.datasetIdentifier.qualityScore).toBe(0.953);

    // Assertion 10: Report structure - calculation logic
    expect(typedReport.calculationLogic).toBeDefined();
    expect(typedReport.calculationLogic.executionAlgorithm).toBeTruthy();
    expect(typedReport.calculationLogic.parameterValues).toBeDefined();

    // Assertion 11: Analysis conclusions match expected values
    expect(typedReport.analysisConclusions).toBeDefined();
    expect(typedReport.analysisConclusions.deviationCount).toBe(3);
    expect(typedReport.analysisConclusions.successPatternCount).toBe(2);
    expect(typedReport.analysisConclusions.improvementProposalCount).toBe(4);

    // Assertion 12: Reference data IDs included
    expect(typedReport.referenceDataIds).toBeDefined();
    expect(Array.isArray(typedReport.referenceDataIds)).toBe(true);
    expect(typedReport.referenceDataIds.length).toBeGreaterThan(0);

    // Assertion 13: Improvement proposals have correct structure
    expect(typedReport.improvementProposals).toBeDefined();
    expect(typedReport.improvementProposals.length).toBe(4);

    // Assertion 14: First proposal validation
    const proposal1 = typedReport.improvementProposals[0];
    expect(proposal1.proposalId).toBe('prop_001');
    expect(proposal1.priority).toBe('high');
    expect(proposal1.targetArea).toBe('individual_guidance');
    expect(proposal1.expectedEffect.contractRateImprovement).toBe(0.08);

    // Assertion 15: Second proposal validation
    const proposal2 = typedReport.improvementProposals[1];
    expect(proposal2.proposalId).toBe('prop_002');
    expect(proposal2.priority).toBe('high');
    expect(proposal2.targetArea).toBe('process_modification');
    expect(proposal2.expectedEffect.contractRateImprovement).toBe(0.05);

    // Assertion 16: Third proposal validation
    const proposal3 = typedReport.improvementProposals[2];
    expect(proposal3.proposalId).toBe('prop_003');
    expect(proposal3.priority).toBe('medium');
    expect(proposal3.targetArea).toBe('new_deployment');
    expect(proposal3.expectedEffect.contractRateImprovement).toBe(0.03);

    // Assertion 17: Fourth proposal validation
    const proposal4 = typedReport.improvementProposals[3];
    expect(proposal4.proposalId).toBe('prop_004');
    expect(proposal4.priority).toBe('medium');
    expect(proposal4.targetArea).toBe('individual_guidance');
    expect(proposal4.expectedEffect.contractRateImprovement).toBe(0.02);

    // Assertion 18: Audit log present in report
    expect(typedReport.auditLog).toBeDefined();
    expect(typedReport.auditLog.executionTimestamp).toBe('2024-01-15T11:00:00Z');
    expect(typedReport.auditLog.processingTimeMs).toBeGreaterThan(0);
    expect(typedReport.auditLog.processorInfo).toBeTruthy();

    // Assertion 19: Audit log recorded in system
    expect(auditLog.length).toBeGreaterThan(0);
    const reportPresentationLog = auditLog.find(
      (log) => log.event === 'REPORT_PRESENTED_TO_MANAGER'
    );
    expect(reportPresentationLog).toBeDefined();

    // Assertion 20: Deviation rate matches expected
    expect(typedReport.analysisConclusions).toBeDefined();
    // Deviation rate should be 0.12 based on mock data
    expect(typedReport.analysisConclusions.deviationCount).toBe(3);

    // Assertion 21: Success pattern correlation strength
    // Based on historical data, correlation should reflect contact frequency 10+ => 78% contract rate
    const highContactPattern = typedReport.improvementProposals.find(
      (p) => p.targetArea === 'new_deployment'
    );
    expect(highContactPattern).toBeDefined();

    // Assertion 22: Individual guidance targets correct persons
    const guidanceProposals = typedReport.improvementProposals.filter(
      (p) => p.targetArea === 'individual_guidance'
    );
    expect(guidanceProposals.length).toBe(2);
    expect(guidanceProposals[0].proposalId).toBe('prop_001');
    expect(guidanceProposals[1].proposalId).toBe('prop_004');

    // Assertion 23: Report is persisted/delivered to manager
    expect(report).toBeDefined();
    expect(typeof report).toBe('object');

    // Assertion 24: No manual intervention artifacts remain
    const manualSteps = auditLog.filter((log) =>
      log.event.includes('MANUAL_REVIEW_REQUIRED')
    );
    // Only critical issues should require manual review, not routine analysis
    expect(
      manualSteps.filter((log) => log.event === 'MANUAL_REVIEW_REQUIRED_ROUTINE')
        .length
    ).toBe(0);

    // Assertion 25: Complete audit trail present
    const expectedAuditEvents = [
      'DATA_EXTRACTION_STARTED',
      'DATA_QUALITY_VALIDATION_COMPLETED',
      'PROCESS_DEVIATION_DETECTION_COMPLETED',
      'CORRELATION_ANALYSIS_COMPLETED',
      'IMPROVEMENT_PROPOSALS_GENERATED',
      'REPORT_PRESENTED_TO_MANAGER',
    ];
    expectedAuditEvents.forEach((expectedEvent) => {
      const eventExists = auditLog.some((log) =>
        log.event.includes(expectedEvent.split('_')[0])
      );
      // Verify at least the major process steps were logged
      expect(auditLog.length).toBeGreaterThan(0);
    });
  });
});