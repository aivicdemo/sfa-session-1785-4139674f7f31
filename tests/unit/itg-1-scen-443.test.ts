import { analyzeAsSalesRep } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-443
  test('[edge] 提案内容が空の状態で分析が実行される場合、提案内容なしとして処理される', async () => {
    const sales_rep_id = 'SR-001';
    const analysis_start_date = new Date('2024-01-01T00:00:00Z');
    const analysis_end_date = new Date('2024-01-31T23:59:59Z');
    const proposal_content = '';
    const contract_count = 5;
    const total_activity_count = 25;
    const contract_rate = 0.2;

    const result = await analyzeAsSalesRep({
      sales_rep_id,
      analysis_start_date,
      analysis_end_date,
      proposal_content,
      contract_count,
      total_activity_count,
      contract_rate,
    });

    expect(result.status).toBe('completed');
    expect(result.proposal_content).toBe('');
    expect(result.proposal_content_status).toBe('提案内容なし');
    expect(result.activity_count).toBe(25);
    expect(result.contract_count).toBe(5);
    expect(result.contract_rate).toBe(0.2);
    expect(result.behavior_pattern_classification).toBeDefined();
  });
});