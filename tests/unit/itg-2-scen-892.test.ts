import { validateProposalDataCompleteness } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客購買検討データ入力検証機能 - 提案内容複数件の完全性検証', () => {
  // SCEN-892
  test('提案内容データが複数件のときすべてのレコードに対して完全性検証を実行する', () => {
    const proposalDataset = [
      {
        proposal_id: 'PROP-001',
        proposal_amount: 500000,
        proposal_expiry_date: '2024-12-31',
        proposal_owner_code: 'EMP-001'
      },
      {
        proposal_id: 'PROP-002',
        proposal_amount: 750000,
        proposal_expiry_date: '2024-11-30',
        proposal_owner_code: 'EMP-002'
      },
      {
        proposal_id: 'PROP-003',
        proposal_amount: 1000000,
        proposal_expiry_date: '2024-10-31',
        proposal_owner_code: 'EMP-003'
      }
    ];

    const validationResult = validateProposalDataCompleteness(proposalDataset);

    expect(validationResult).toEqual([
      {
        proposal_id: 'PROP-001',
        validation_status: 'PASS',
        validation_item_count: 3
      },
      {
        proposal_id: 'PROP-002',
        validation_status: 'PASS',
        validation_item_count: 3
      },
      {
        proposal_id: 'PROP-003',
        validation_status: 'PASS',
        validation_item_count: 3
      }
    ]);
  });
});