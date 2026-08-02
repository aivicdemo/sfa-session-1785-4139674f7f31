import { validatePurchaseHistoryAgainstProposal } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-911
  test('購買履歴の購買日付が提案内容の提案作成日より前のとき矛盾を検出する', () => {
    const proposalData = {
      proposal_id: 'PROP-001',
      proposal_created_date: new Date('2024-01-15T00:00:00Z'),
      proposal_content: 'Sample Product Proposal',
    };

    const purchaseHistory = {
      purchase_history_id: 'HIST-001',
      purchase_date: new Date('2024-01-10T00:00:00Z'),
      purchase_amount: 50000,
    };

    const result = validatePurchaseHistoryAgainstProposal(
      proposalData,
      purchaseHistory
    );

    expect(result).toEqual({
      code: 'PURCHASE_DATE_BEFORE_PROPOSAL_DATE',
      message: '購買日付は提案作成日以降である必要があります',
      severity: 'error',
    });
  });
});