import { filterRecommendationsByCustomerConstraints } from '../../src/logic/it-1-br-3-3-2-1';

describe('顧客制約条件との照合機能', () => {
  // SCEN-1169
  test('提案内容が顧客の購入可能カテゴリ制限に違反するとき、該当提案を推奨候補から外す', () => {
    const customer_id = 'CUST_A';
    const customer_name = '顧客A';
    const allowed_categories = ['カテゴリ1', 'カテゴリ2'];

    const proposal_candidates = [
      {
        proposal_id: 'PROP_001',
        product_name: '商品X',
        category: 'カテゴリ3',
      },
      {
        proposal_id: 'PROP_002',
        product_name: '商品Y',
        category: 'カテゴリ1',
      },
      {
        proposal_id: 'PROP_003',
        product_name: '商品Z',
        category: 'カテゴリ2',
      },
    ];

    const customer_constraints = {
      customer_id: customer_id,
      customer_name: customer_name,
      allowed_categories: allowed_categories,
    };

    const filtered_recommendations = filterRecommendationsByCustomerConstraints(
      customer_constraints,
      proposal_candidates
    );

    expect(filtered_recommendations).toHaveLength(2);
    expect(filtered_recommendations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          proposal_id: 'PROP_002',
          product_name: '商品Y',
          category: 'カテゴリ1',
        }),
        expect.objectContaining({
          proposal_id: 'PROP_003',
          product_name: '商品Z',
          category: 'カテゴリ2',
        }),
      ])
    );

    const excluded_proposals = filtered_recommendations.filter(
      (p) => p.proposal_id === 'PROP_001'
    );
    expect(excluded_proposals).toHaveLength(0);
  });
});