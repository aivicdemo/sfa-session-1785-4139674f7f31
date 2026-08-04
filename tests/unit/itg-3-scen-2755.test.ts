import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2755
  test('推奨根拠データが重複を含むとき、重複排除後の一意な根拠のみが可視化される', () => {
    const mock_ai_engine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: 'rec_001',
        customer_id: 'cust_001',
        proposal_approach: 'アプローチA',
        confidence_score: 85,
        reasoning_basis: [
          { basis_id: 'basis_A', reason_text: '根拠A', evidence_source: 'historical_data' },
          { basis_id: 'basis_B', reason_text: '根拠B', evidence_source: 'customer_profile' },
          { basis_id: 'basis_A', reason_text: '根拠A', evidence_source: 'historical_data' },
          { basis_id: 'basis_C', reason_text: '根拠C', evidence_source: 'market_trend' },
          { basis_id: 'basis_B', reason_text: '根拠B', evidence_source: 'customer_profile' }
        ]
      })
    };

    const customer_info = {
      customer_id: 'cust_001',
      industry: '製造業',
      company_size: '中規模'
    };

    const result = generateRecommendation(customer_info, mock_ai_engine);

    return result.then((rec_result) => {
      const unique_bases = Array.from(
        new Map(
          rec_result.reasoning_basis.map((item) => [item.basis_id, item])
        ).values()
      );

      expect(unique_bases).toHaveLength(3);
      expect(unique_bases[0].basis_id).toBe('basis_A');
      expect(unique_bases[1].basis_id).toBe('basis_B');
      expect(unique_bases[2].basis_id).toBe('basis_C');
      expect(rec_result.confidence_score).toBe(85);
    });
  });
});