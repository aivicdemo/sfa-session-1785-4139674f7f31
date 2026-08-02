import { approveModificationRule } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-572
  test('修正ルール承認判定機能 - 承認対象の修正ルール案が1件の場合、判定が正確に実行される', () => {
    const executionStartTime = new Date('2024-01-15T10:00:00Z');
    
    const modificationRuleProposal = {
      ruleId: 'RULE-001',
      targetField: '顧客名',
      modificationPattern: '半角スペース除去',
      applicableDataCount: 150,
      proposedAt: executionStartTime.toISOString()
    };

    const pastApprovalCases = {
      successCount: 50,
      rejectionCount: 5,
      similarPatternMatches: 30,
      similarPatternSuccessRate: 1.0
    };

    const ruleStandardMaster = {
      currentVersion: 'v2.1',
      approvalCriteria: {
        minSuccessRate: 0.8,
        maxApplicableDataCount: 10000
      }
    };

    const result = approveModificationRule(
      modificationRuleProposal,
      pastApprovalCases,
      ruleStandardMaster
    );

    const executionEndTime = new Date();
    const timeDifferenceSeconds = (executionEndTime.getTime() - executionStartTime.getTime()) / 1000;

    expect(result.approvalStatus).toMatch(/承認推奨|却下推奨/);
    expect(result.approvalReason).toContain('過去');
    expect(result.approvalReason).toContain('成功');
    expect(result.dataCountValidationResult).toBe('妥当');
    expect(result.ruleStandardComplianceStatus).toBe('基準適合');
    expect(result.completedAt).toBeDefined();
    expect(timeDifferenceSeconds).toBeLessThanOrEqual(5);
  });
});