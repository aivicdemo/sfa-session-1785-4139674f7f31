import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1085
  test('複数営業担当者の成約実績が重複して集計される場合に正確に分離される', () => {
    const salesRepA = 'salesrep_001';
    const salesRepB = 'salesrep_002';
    const dealId = 'deal-001';
    const contractDateA = '2024-01-15T00:00:00Z';
    const contractDateB = '2024-01-20T00:00:00Z';

    const contractHistories = [
      {
        deal_id: dealId,
        sales_rep_id: salesRepA,
        contract_date: contractDateA,
        contract_amount: 500000,
      },
      {
        deal_id: dealId,
        sales_rep_id: salesRepB,
        contract_date: contractDateB,
        contract_amount: 300000,
      },
    ];

    const result = selectAnalysisIndicators(contractHistories);

    expect(result.analysis_indicators).toBeDefined();
    expect(Array.isArray(result.analysis_indicators)).toBe(true);

    const repAIndicators = result.analysis_indicators.filter(
      (ind) => ind.sales_rep_id === salesRepA
    );
    const repBIndicators = result.analysis_indicators.filter(
      (ind) => ind.sales_rep_id === salesRepB
    );

    expect(repAIndicators.length).toBe(1);
    expect(repBIndicators.length).toBe(1);

    expect(repAIndicators[0].deal_id).toBe(dealId);
    expect(repAIndicators[0].contract_date).toBe(contractDateA);
    expect(repAIndicators[0].contract_count).toBe(1);

    expect(repBIndicators[0].deal_id).toBe(dealId);
    expect(repBIndicators[0].contract_date).toBe(contractDateB);
    expect(repBIndicators[0].contract_count).toBe(1);

    const totalContractCount = result.analysis_indicators.reduce(
      (sum, ind) => sum + ind.contract_count,
      0
    );
    expect(totalContractCount).toBe(2);
  });
});