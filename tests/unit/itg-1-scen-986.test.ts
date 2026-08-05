import { evaluateSuccessFactorApprovalCriteria } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-986: [edge] 成功要因・失敗要因の抽出と承認基準判定機能 - 抽出された要因数が承認基準の下限ちょうどのとき承認可能と判定される
  test('成功要因・失敗要因の抽出数がちょうど下限値のときに承認可能と判定される', () => {
    const minimum_factor_count = 3;
    const success_factors = [
      { id: 'sf_001', description: '顧客との信頼関係構築' },
      { id: 'sf_002', description: '提案資料の質の高さ' }
    ];
    const failure_factors = [
      { id: 'ff_001', description: '初期接触タイミングの遅延' }
    ];

    const extracted_factors = [
      ...success_factors,
      ...failure_factors
    ];

    const total_factor_count = extracted_factors.length;

    const result = evaluateSuccessFactorApprovalCriteria({
      extracted_factors: extracted_factors,
      minimum_factor_count: minimum_factor_count
    });

    expect(total_factor_count).toBe(3);
    expect(result.approval_status).toBe('APPROVED');
    expect(result.approval_reason).toMatch(/下限値/);
  });
});