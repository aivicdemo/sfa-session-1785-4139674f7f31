import { analyzeProcessDeviation } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-637
  test('提案内容の標準プロセス乖離度が許容閾値直上（+5.1%）のとき、許容範囲外として検出される', () => {
    const proposalDeviation = 5.1;
    const toleranceThreshold = 5.0;
    const baselineProcessAlignment = 100;

    const testData = {
      proposedApproachDeviation: proposalDeviation,
      standardProcessBaseline: baselineProcessAlignment,
      toleranceThresholdPercent: toleranceThreshold,
      proposalContent: {
        customerSegment: 'enterprise',
        productCategory: 'SaaS',
        proposalTiming: 'day_3_after_contact',
        approachDescription: 'accelerated_closing_attempt'
      },
      salesFlowSequence: [
        { step: 'initial_contact', completed: true, delayDays: 0 },
        { step: 'needs_analysis', completed: true, delayDays: 1 },
        { step: 'proposal_presentation', completed: true, delayDays: 2 },
        { step: 'contract_negotiation', completed: false, delayDays: 0 }
      ]
    };

    const result = analyzeProcessDeviation(testData);

    expect(result.status).toBe('OUT_OF_TOLERANCE');
    expect(result.isOutOfTolerance).toBe(true);
    expect(result.deviationPercentage).toBe(5.1);
    expect(result.warningFlagActive).toBe(true);
    expect(result.auditRecord).toEqual({
      deviationPercentage: 5.1,
      toleranceStatus: 'THRESHOLD_EXCEEDED',
      recommendedAction: 'PROCESS_REVIEW_REQUIRED',
      detectionLevel: 'EDGE_CASE_DETECTED',
      complianceIndicator: false
    });
    expect(result.auditRecord.toleranceStatus).toBe('THRESHOLD_EXCEEDED');
    expect(result.auditRecord.recommendedAction).toBe('PROCESS_REVIEW_REQUIRED');
  });
});