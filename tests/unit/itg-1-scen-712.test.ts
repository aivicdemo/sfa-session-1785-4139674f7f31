import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import {
  analyzeProposalAndCustomerResponsePattern,
  ProposalAndPatternAnalysisInput,
  ProposalAndPatternAnalysisResult,
  AuditLogEntry,
} from '../../src/logic/it-1-br-2-1-1';

describe('提案内容と顧客対応パターンの標準プロセス比較分析', () => {
  let auditLogs: AuditLogEntry[] = [];

  beforeEach(() => {
    auditLogs = [];
  });

  afterEach(() => {
    auditLogs = [];
  });

  // SCEN-712
  test('適合性スコアが合格閾値と一致する場合、異常判定フラグがfalseで判定ステータスが合格である', () => {
    const passingThreshold = 75.0;
    const proposalCompatibilityScore = 75.0;

    const input: ProposalAndPatternAnalysisInput = {
      proposalContent: {
        proposalId: 'PROP-20240115-001',
        customerId: 'CUST-001',
        salesPersonId: 'SALES-001',
        proposalTitle: '標準システム導入提案',
        proposalDescription: '顧客のビジネス要件に基づいた標準システムの導入を提案',
        productCategory: 'システム',
        proposedPrice: 5000000,
        compatibilityScore: proposalCompatibilityScore,
        processAlignmentScore: 78.5,
        createdAt: '2024-01-15T10:00:00Z',
      },
      standardProcessDefinition: {
        processId: 'PROC-STD-001',
        processName: '標準営業プロセス',
        stages: [
          {
            stageId: 'STAGE-CONTACT',
            stageName: '初回接触',
            expectedDuration: 7,
          },
          {
            stageId: 'STAGE-PROPOSAL',
            stageName: '提案',
            expectedDuration: 14,
          },
          {
            stageId: 'STAGE-NEGOTIATION',
            stageName: '交渉',
            expectedDuration: 21,
          },
          {
            stageId: 'STAGE-CLOSE',
            stageName: '成約',
            expectedDuration: 7,
          },
        ],
        passingThreshold: passingThreshold,
        lastUpdated: '2024-01-01T00:00:00Z',
      },
      customerResponsePattern: {
        customerId: 'CUST-001',
        contactFrequency: 8,
        responseRate: 0.875,
        averageResponseTimeHours: 24,
        engagementLevel: 'HIGH',
      },
      analysisContext: {
        analysisId: 'ANALYSIS-20240115-001',
        analysisTimestamp: '2024-01-15T11:00:00Z',
        auditLogCollector: (entry: AuditLogEntry) => {
          auditLogs.push(entry);
        },
      },
    };

    const result: ProposalAndPatternAnalysisResult =
      analyzeProposalAndCustomerResponsePattern(input);

    expect(result.isAnomalyDetected).toBe(false);
    expect(result.judgmentStatus).toBe('合格');
    expect(result.compatibilityScoreFinal).toBe(75.0);

    const auditLogWithBoundaryMessage = auditLogs.find(
      (log) =>
        log.logType === 'COMPATIBILITY_SCORE_JUDGMENT' &&
        log.message.includes('境界値で合格'),
    );

    expect(auditLogWithBoundaryMessage).toBeDefined();
    expect(auditLogWithBoundaryMessage?.message).toBe(
      '適合性スコア: 75.0 - 合格閾値: 75.0 - 判定: 境界値で合格',
    );
  });
});