import { integrateBusinessDataWithProposals } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-967
  test('[normal] 購買結果記録・営業データ統合機能 - 購買結果に関連する提案内容が複数件の場合にすべて統合される', () => {
    const purchase_result = {
      purchase_result_id: 'PR-001',
      customer_id: 'CUST-001',
      purchase_date: '2024-01-15',
      amount: 50000,
    };

    const proposals = [
      {
        proposal_id: 'PROP-101',
        customer_id: 'CUST-001',
        proposal_content: 'Solution A',
      },
      {
        proposal_id: 'PROP-102',
        customer_id: 'CUST-001',
        proposal_content: 'Solution B',
      },
      {
        proposal_id: 'PROP-103',
        customer_id: 'CUST-001',
        proposal_content: 'Solution C',
      },
    ];

    const integrated_result = integrateBusinessDataWithProposals(
      purchase_result,
      proposals
    );

    expect(integrated_result).toEqual({
      purchase_result_id: 'PR-001',
      customer_id: 'CUST-001',
      purchase_date: '2024-01-15',
      amount: 50000,
      integrated_proposals: [
        {
          purchase_result_id: 'PR-001',
          proposal_id: 'PROP-101',
          proposal_content: 'Solution A',
        },
        {
          purchase_result_id: 'PR-001',
          proposal_id: 'PROP-102',
          proposal_content: 'Solution B',
        },
        {
          purchase_result_id: 'PR-001',
          proposal_id: 'PROP-103',
          proposal_content: 'Solution C',
        },
      ],
    });

    expect(integrated_result.integrated_proposals).toHaveLength(3);
    expect(integrated_result.integrated_proposals[0].proposal_id).toBe(
      'PROP-101'
    );
    expect(integrated_result.integrated_proposals[1].proposal_id).toBe(
      'PROP-102'
    );
    expect(integrated_result.integrated_proposals[2].proposal_id).toBe(
      'PROP-103'
    );
  });
});