import { determineProposalApproachBySuccessPattern } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-292
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 購買シグナル欠落時はスキップ', () => {
    const customer = {
      customer_id: 'CUST-001',
      company_name: 'Example Corp',
      budget_approval_status: null,
      implementation_timeline: null,
      competitor_info: null,
      needs_level: null,
    };

    const successPatternMatrix = [
      {
        pattern_id: 'PAT-001',
        budget_status: 'approved',
        implementation_timeline: 'immediate',
        priority: 'high',
        approach: 'immediate_proposal',
      },
      {
        pattern_id: 'PAT-002',
        budget_status: 'pending',
        implementation_timeline: 'mid_term',
        priority: 'medium',
        approach: 'nurture_engagement',
      },
      {
        pattern_id: 'PAT-003',
        budget_status: 'not_planned',
        implementation_timeline: 'long_term',
        priority: 'low',
        approach: 'educational_content',
      },
    ];

    const result = determineProposalApproachBySuccessPattern(
      customer,
      successPatternMatrix
    );

    expect(result).toEqual({
      skipped: true,
      message: '購買シグナルが不足しているため優先度判定をスキップしました',
      priority: null,
      approach: null,
      pattern_matched: null,
    });
    expect(result.skipped).toBe(true);
    expect(result.message).toContain('購買シグナル');
    expect(result.priority).toBeNull();
    expect(result.approach).toBeNull();
    expect(result.pattern_matched).toBeNull();
  });
});