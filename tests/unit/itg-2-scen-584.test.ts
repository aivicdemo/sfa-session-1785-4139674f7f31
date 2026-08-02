import { judgeModificationRuleApproval } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-584
  test('修正ルール承認判定機能 - 同じ修正ルール案に対して2回目の判定を実行した場合、同じ結果が返される', () => {
    const modificationRuleInput = {
      ruleId: 'RULE-001',
      ruleName: '顧客名の半角・全角統一ルール',
      ruleType: 'normalization',
      targetField: 'customer_name',
      normalizationLogic: 'convert_to_full_width',
      appliedRecordCount: 150,
      affectedCustomerCount: 145,
      estimatedDataQualityImprovementScore: 8.5,
      pastAppliedExampleIds: ['EX-2024-001', 'EX-2024-002', 'EX-2024-003'],
      riskLevel: 'low',
      approverAuthority: 'manager',
      createdAt: '2024-01-15T10:00:00Z',
      modifiedAt: '2024-01-15T10:00:00Z',
    };

    const firstJudgmentResult = judgeModificationRuleApproval(modificationRuleInput);

    const firstApprovalDecision = firstJudgmentResult.approvalDecision;
    const firstRecommendationReason = firstJudgmentResult.recommendationReason;
    const firstReferencedExampleIds = firstJudgmentResult.referencedExampleIds;
    const firstConfidenceScore = firstJudgmentResult.confidenceScore;

    const secondJudgmentResult = judgeModificationRuleApproval(modificationRuleInput);

    const secondApprovalDecision = secondJudgmentResult.approvalDecision;
    const secondRecommendationReason = secondJudgmentResult.recommendationReason;
    const secondReferencedExampleIds = secondJudgmentResult.referencedExampleIds;
    const secondConfidenceScore = secondJudgmentResult.confidenceScore;

    expect(secondApprovalDecision).toBe(firstApprovalDecision);
    expect(secondRecommendationReason).toBe(firstRecommendationReason);
    expect(secondReferencedExampleIds).toEqual(firstReferencedExampleIds);
    expect(secondConfidenceScore).toBe(firstConfidenceScore);
  });
});