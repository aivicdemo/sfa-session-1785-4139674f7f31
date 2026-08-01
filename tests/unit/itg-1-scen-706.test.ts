import { calculateSuccessFactorApprovalStatus } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-706
  test('成功・失敗要因の抽出と承認基準判定機能 - 要因の信頼度スコアが承認基準の最小値ちょうどのとき、承認可能と判定される', () => {
    const min_confidence_threshold = 70;
    const factor_data = {
      factor_id: 'SF-001',
      factor_name: '初回接触から提案までの期間が10日以内',
      factor_type: 'success',
      confidence_score: 70,
      occurrence_count: 25,
      success_count: 18,
      created_at: new Date('2024-01-15T11:00:00Z'),
    };

    const result = calculateSuccessFactorApprovalStatus(
      factor_data,
      min_confidence_threshold
    );

    expect(result.is_approvable).toBe(true);
    expect(result.approval_status).toMatch(/承認対象|承認済み/);
    expect(result.confidence_score).toBe(70);
  });
});