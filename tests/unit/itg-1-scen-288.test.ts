import { evaluateProposalApproachBySimilarity } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-288
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 類似度スコアが業務基準値下限と完全に一致する場合、適用可能と判定される', () => {
    const similarity_score = 0.75;
    const business_threshold_lower_bound = 0.75;
    const success_pattern_record = {
      pattern_id: 'pattern_001',
      similarity_score: similarity_score,
      customer_attributes: { industry: 'technology', company_size: 'mid' },
      proposal_content: 'cloud_migration_service',
      contract_status: 'won',
    };

    const result = evaluateProposalApproachBySimilarity({
      success_pattern: success_pattern_record,
      business_threshold_lower_bound: business_threshold_lower_bound,
    });

    expect(result.judgment_status).toBe('適用可能');
    expect(result.judgment_basis).toBe(
      '類似度スコア: 0.75（業務基準値下限: 0.75）により条件満たす'
    );
    expect(result.is_applicable).toBe(true);
  });
});