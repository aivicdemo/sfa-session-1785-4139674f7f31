import { calculateProposalNeedsAlignment } from '../../src/logic/it-1-br-2-2-1-1';

describe('Proposal Material and Customer Needs Alignment', () => {
  // SCEN-728
  test('should identify single unmatched requirement and calculate alignment score as 66.7%', () => {
    const proposalMaterial = {
      product_id: 'PROD_A',
      product_name: 'Product A',
      features: ['feature_1', 'feature_2', 'feature_3'],
    };

    const customerNeeds = {
      customer_id: 'CUST_001',
      mandatory_requirements: ['feature_1', 'feature_2', 'feature_3', 'feature_4'],
    };

    const result = calculateProposalNeedsAlignment(proposalMaterial, customerNeeds);

    expect(result.alignment_score).toBe(66.7);
    expect(result.unmatched_items).toHaveLength(1);
    expect(result.unmatched_items[0]).toEqual({
      requirement_name: 'feature_4',
      reason: 'Customer mandatory requirement not included in proposal material',
    });
    expect(result.matched_count).toBe(3);
    expect(result.total_requirements).toBe(4);
  });
});