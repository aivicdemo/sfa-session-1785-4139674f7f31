import { calculateProposalApproachMatchScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-284
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 業界特性が完全一致する場合、高マッチング度で判定される', () => {
    const success_pattern_matrix = [
      {
        industry: '製造業',
        proposal_method: '技術説明会',
        success_rate: 85,
      },
    ];

    const current_customer = {
      industry: '製造業',
    };

    const result = calculateProposalApproachMatchScore(
      success_pattern_matrix,
      current_customer
    );

    expect(result.matching_score).toBeGreaterThanOrEqual(85);
    expect(result.recommended_proposal_method).toBe('技術説明会');
  });
});