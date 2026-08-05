import { expandProcessTransitionRuleToRequirements } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-171: [normal] プロセス遷移ルールの要件仕様化機能 - プロセス段階間の遷移ルールが条件分岐を含む場合、全分岐条件が要件仕様に正しく展開される
  test('should expand process transition rule with multiple branch conditions to requirements specification correctly', () => {
    const input = {
      transitionRuleId: 'rule_001',
      sourceStage: '見積提出',
      destinationStage: '受注確定',
      hasBranchCondition: true,
      branchConditions: [
        {
          conditionId: 'cond_001',
          conditionExpression: '受注金額≧100万円',
          threshold: 1000000,
          operator: '>=',
          destinationStageForBranch: '受注確定_大型案件',
        },
        {
          conditionId: 'cond_002',
          conditionExpression: '受注金額＜100万円',
          threshold: 1000000,
          operator: '<',
          destinationStageForBranch: '受注確定_通常案件',
        },
      ],
      defaultCondition: {
        conditionId: 'cond_default',
        conditionExpression: 'その他',
        destinationStageForBranch: '見積見直し',
      },
    };

    const result = expandProcessTransitionRuleToRequirements(input);

    expect(result.transitionRuleId).toBe('rule_001');
    expect(result.sourceStage).toBe('見積提出');
    expect(result.destinationStage).toBe('受注確定');
    expect(result.requirementsDocument).toBeDefined();

    const doc = result.requirementsDocument;
    expect(doc).toContain('rule_001');
    expect(doc).toContain('見積提出');
    expect(doc).toContain('受注確定');

    expect(doc).toContain('受注金額≧100万円');
    expect(doc).toContain('受注確定_大型案件');

    expect(doc).toContain('受注金額＜100万円');
    expect(doc).toContain('受注確定_通常案件');

    expect(doc).toContain('その他');
    expect(doc).toContain('見積見直し');

    const branchCount = (doc.match(/分岐条件/g) || []).length;
    expect(branchCount).toBe(2);

    const defaultCount = (doc.match(/デフォルト条件/g) || []).length;
    expect(defaultCount).toBe(1);

    expect(result.expandedConditionCount).toBe(3);
    expect(result.allConditionsMapped).toBe(true);
  });
});