import { describe, test, expect, beforeEach } from '@jest/globals';
import {
  calculateIssueImportanceAndNecessity,
} from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-855
  test('検出期間が月末日を含むとき期間判定が正確に行われる', () => {
    const detectionStartDate = new Date('2024-02-01T00:00:00Z');
    const detectionEndDate = new Date('2024-02-28T23:59:59Z');

    const detectionResults = [
      {
        id: 'issue_001',
        detectedAt: new Date('2024-02-01T10:30:00Z'),
        issueType: 'process_deviation',
        severity: 'high',
        affectedSalesPersonId: 'sales_001',
        description: 'Initial contact not performed within standard timeline',
        evidenceData: {
          expectedStepName: 'Initial contact',
          actualCompletionDate: new Date('2024-02-02T15:00:00Z'),
          plannedCompletionDate: new Date('2024-02-01T17:00:00Z'),
        },
        relatedMetrics: {
          processComplianceRate: 0.72,
          successRateDeviation: -0.15,
        },
      },
      {
        id: 'issue_002',
        detectedAt: new Date('2024-02-15T14:20:00Z'),
        issueType: 'proposal_quality',
        severity: 'medium',
        affectedSalesPersonId: 'sales_002',
        description: 'Proposal content does not align with customer needs',
        evidenceData: {
          proposalId: 'prop_456',
          customerNeedsAlignment: 0.65,
          standardAlignmentThreshold: 0.80,
        },
        relatedMetrics: {
          proposalAcceptanceRate: 0.58,
          successRateDeviation: -0.08,
        },
      },
      {
        id: 'issue_003',
        detectedAt: new Date('2024-02-28T23:45:30Z'),
        issueType: 'followup_timing',
        severity: 'low',
        affectedSalesPersonId: 'sales_003',
        description: 'Follow-up conducted outside recommended time window',
        evidenceData: {
          followupExecutedAt: new Date('2024-02-28T23:30:00Z'),
          recommendedWindowStart: new Date('2024-02-28T09:00:00Z'),
          recommendedWindowEnd: new Date('2024-02-28T17:00:00Z'),
        },
        relatedMetrics: {
          followupSuccessRate: 0.42,
          successRateDeviation: -0.12,
        },
      },
      {
        id: 'issue_004',
        detectedAt: new Date('2024-03-01T08:00:00Z'),
        issueType: 'process_deviation',
        severity: 'medium',
        affectedSalesPersonId: 'sales_001',
        description: 'Process step skipped in March period',
        evidenceData: {
          stepName: 'Negotiation phase',
          skippedAt: new Date('2024-03-01T07:30:00Z'),
        },
        relatedMetrics: {
          processComplianceRate: 0.68,
        },
      },
    ];

    const result = calculateIssueImportanceAndNecessity({
      detectionPeriodStartDate: detectionStartDate,
      detectionPeriodEndDate: detectionEndDate,
      detectionResults: detectionResults,
    });

    expect(result.totalIssuesInPeriod).toBe(3);
    expect(result.issuePeriodStartDate).toEqual(new Date('2024-02-01T00:00:00Z'));
    expect(result.issuePeriodEndDate).toEqual(new Date('2024-02-28T23:59:59Z'));

    const processedIssueIds = result.processedIssues.map(
      (issue: { id: string }) => issue.id
    );
    expect(processedIssueIds).toContain('issue_001');
    expect(processedIssueIds).toContain('issue_002');
    expect(processedIssueIds).toContain('issue_003');
    expect(processedIssueIds).not.toContain('issue_004');

    const importanceScores = result.processedIssues.map(
      (issue: { importanceScore: number }) => issue.importanceScore
    );
    expect(importanceScores[0]).toBeGreaterThan(importanceScores[1]);
    expect(importanceScores[1]).toBeGreaterThan(importanceScores[2]);

    const actionNecessityValues = result.processedIssues.map(
      (issue: { actionNecessity: number }) => issue.actionNecessity
    );
    expect(actionNecessityValues[0]).toBeGreaterThanOrEqual(0.7);
    expect(actionNecessityValues[1]).toBeGreaterThanOrEqual(0.5);
    expect(actionNecessityValues[2]).toBeLessThan(0.5);

    expect(result.processedIssues[0].evidenceRationale).toMatch(/timeline/i);
    expect(result.processedIssues[1].evidenceRationale).toMatch(/alignment/i);
    expect(result.processedIssues[2].evidenceRationale).toMatch(/window/i);

    expect(result.prioritizedActionList.length).toBe(3);
    expect(result.prioritizedActionList[0].issueId).toBe('issue_001');
    expect(result.prioritizedActionList[1].issueId).toBe('issue_002');
    expect(result.prioritizedActionList[2].issueId).toBe('issue_003');

    result.processedIssues.forEach(
      (issue: { detectedAtInPeriod: boolean; detectedAt: Date }) => {
        const detectedAtTime = issue.detectedAt.getTime();
        const periodStartTime = detectionStartDate.getTime();
        const periodEndTime = detectionEndDate.getTime();
        expect(detectedAtTime).toBeGreaterThanOrEqual(periodStartTime);
        expect(detectedAtTime).toBeLessThanOrEqual(periodEndTime);
        expect(issue.detectedAtInPeriod).toBe(true);
      }
    );
  });
});