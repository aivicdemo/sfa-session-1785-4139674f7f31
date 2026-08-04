import { evaluateProposalRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 複数顧客ニーズの妥当性判定', () => {
  // SCEN-1252: [edge] 提案妥当性判定機能 - 参照される顧客ニーズが複数件のときにすべてが妥当性判定に反映される
  test('複数の顧客ニーズ(3件以上)がすべて妥当性判定に反映される', () => {
    const customer_need_1 = {
      customer_need_id: 'CN001',
      customer_need_type: 'コスト削減',
      priority: 'high',
    };

    const customer_need_2 = {
      customer_need_id: 'CN002',
      customer_need_type: '業務効率化',
      priority: 'high',
    };

    const customer_need_3 = {
      customer_need_id: 'CN003',
      customer_need_type: 'セキュリティ強化',
      priority: 'medium',
    };

    const proposal_input = {
      project_id: 'PROJ20240115001',
      customer_id: 'CUST001',
      customer_needs: [customer_need_1, customer_need_2, customer_need_3],
      proposal_content: {
        title: 'クラウド統合ソリューション',
        description: 'コスト最適化とセキュリティを両立した統合ソリューション',
      },
      proposed_at: new Date('2024-01-15T11:00:00Z'),
    };

    const mock_ai_engine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        cost_reduction_score: 0.85,
        efficiency_score: 0.78,
        security_score: 0.82,
      }),
    };

    const result = evaluateProposalRelevance(proposal_input, mock_ai_engine);

    expect(mock_ai_engine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_needs: expect.arrayContaining([
          expect.objectContaining({ customer_need_id: 'CN001' }),
          expect.objectContaining({ customer_need_id: 'CN002' }),
          expect.objectContaining({ customer_need_id: 'CN003' }),
        ]),
      })
    );

    expect(mock_ai_engine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);

    const call_args = mock_ai_engine.evaluatePatternRelevance.mock.calls[0][0];
    expect(call_args.customer_needs).toHaveLength(3);
    expect(call_args.customer_needs.map((cn: any) => cn.customer_need_id)).toEqual([
      'CN001',
      'CN002',
      'CN003',
    ]);

    expect(result.overall_relevance_score).toBe(0.82);

    expect(result.individual_scores).toEqual({
      cost_reduction: 0.85,
      efficiency: 0.78,
      security: 0.82,
    });

    expect(result.reasoning_basis).toContain('顧客ニーズ3件すべてに対応可能');

    expect(result.covered_needs).toEqual(['CN001', 'CN002', 'CN003']);

    expect(result.needs_count).toBe(3);
  });
});