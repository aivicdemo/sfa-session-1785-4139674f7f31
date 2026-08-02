import { evaluateCorrectionRuleApproval } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-577
  test('修正ルール承認判定機能 - 妥当性基準値がちょうど満たされる場合、承認判定が成功する', () => {
    const correctionRuleProposal = {
      ruleId: 'RULE-20240115-001',
      completenessScore: 100.0,
      pastCaseConformityScore: 75.0,
      businessRiskScore: 0.0,
      description: 'Merge duplicate customer records with matching email domains',
      createdAt: new Date('2024-01-15T10:00:00Z'),
      createdBy: 'IT-DEPT-USER-001',
    };

    const approvalCriteria = {
      minCompletenessScore: 100.0,
      minPastCaseConformityScore: 75.0,
      maxBusinessRiskScore: 0.0,
    };

    const pastApprovalExamples = [
      {
        ruleId: 'RULE-20231201-001',
        completenessScore: 100.0,
        pastCaseConformityScore: 75.0,
        businessRiskScore: 0.0,
        approvalStatus: 'approved',
        matchingRate: 0.92,
      },
      {
        ruleId: 'RULE-20231215-002',
        completenessScore: 100.0,
        pastCaseConformityScore: 76.5,
        businessRiskScore: 0.0,
        approvalStatus: 'approved',
        matchingRate: 0.88,
      },
      {
        ruleId: 'RULE-20240101-003',
        completenessScore: 99.5,
        pastCaseConformityScore: 74.0,
        businessRiskScore: 0.5,
        approvalStatus: 'approved',
        matchingRate: 0.78,
      },
    ];

    const result = evaluateCorrectionRuleApproval(
      correctionRuleProposal,
      approvalCriteria,
      pastApprovalExamples,
    );

    expect(result.approvalStatus).toBe('承認可');
    expect(result.reason).toContain('全妥当性基準を満たす');
    expect(result.recommendationBasis.pastCaseCount).toBe(2);
    expect(result.recommendationBasis.averageMatchingRate).toBe(0.9);
    expect(result.recommendationBasis.conformingExampleIds).toEqual([
      'RULE-20231201-001',
      'RULE-20231215-002',
    ]);
    expect(result.evaluatedAt).toEqual(new Date('2024-01-15T10:00:00Z'));
  });
});