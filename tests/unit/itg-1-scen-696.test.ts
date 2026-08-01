import { evaluateApprovalCriteria } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-696
  test('成功要因が0件のとき、承認基準判定が正しく処理される', () => {
    const success_factors = [];
    const failure_factors = [
      {
        failure_factor_id: 'FA001',
        content: '営業資料が不足していた',
      },
    ];

    const result = evaluateApprovalCriteria({
      success_factors,
      failure_factors,
    });

    expect(result.status).toBe('REJECTED');
    expect(result.reason).toContain(
      '成功要因が検出されていないため承認基準を満たしません'
    );
  });
});