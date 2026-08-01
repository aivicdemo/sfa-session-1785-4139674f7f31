import { calculateAIInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-495
  test('AIエージェント推論精度スコア算出機能 - 推論対象の営業担当者提案内容が複数件の場合、すべてを対象に精度スコアが算出される', async () => {
    const employee_id = 'EMP001';
    const proposal_a = {
      proposal_id: 'PROP001',
      employee_id: employee_id,
      proposal_amount: 500000,
      proposal_date: new Date('2024-01-15T09:00:00Z'),
      customer_industry: 'IT',
      customer_company_size: 'large',
      proposal_text: '提案A：クラウドサービス導入',
      proposal_success: true,
    };
    const proposal_b = {
      proposal_id: 'PROP002',
      employee_id: employee_id,
      proposal_amount: 300000,
      proposal_date: new Date('2024-01-20T14:30:00Z'),
      customer_industry: 'Manufacturing',
      customer_company_size: 'medium',
      proposal_text: '提案B：生産管理システム',
      proposal_success: true,
    };
    const proposal_c = {
      proposal_id: 'PROP003',
      employee_id: employee_id,
      proposal_amount: 150000,
      proposal_date: new Date('2024-01-25T11:00:00Z'),
      customer_industry: 'Retail',
      customer_company_size: 'small',
      proposal_text: '提案C：POS連携ツール',
      proposal_success: false,
    };

    const proposals = [proposal_a, proposal_b, proposal_c];

    const result = await calculateAIInferenceAccuracyScore(
      employee_id,
      proposals
    );

    expect(result.employee_id).toBe('EMP001');
    expect(result.accuracy_score).toBeGreaterThanOrEqual(0.0);
    expect(result.accuracy_score).toBeLessThanOrEqual(100.0);
    expect(result.proposal_count).toBe(3);
    expect(typeof result.accuracy_score).toBe('number');
  });
});