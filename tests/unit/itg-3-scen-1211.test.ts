import { confirmProposalValidity } from '../../src/logic/it-1-br-3-1-1-1';

describe('提案妥当性確認判定機能 - 再確認禁止エラーテスト', () => {
  test('SCEN-1211: 提案が既に妥当性確認済み状態のとき、再確認禁止エラーを返す', () => {
    const proposal_id = 'PROP-20250126-001';
    const existing_proposal = {
      proposal_id: proposal_id,
      customer_id: 'CUST-002',
      proposal_content: '提案内容テキスト',
      customer_needs: '顧客ニーズ情報',
      business_constraints: '予算: 500万円、導入時期: Q2',
      confirmation_status: 'VALIDATED',
      confirmed_at: new Date('2025-01-20T10:00:00Z'),
      confirmed_by: 'SALES-MGR-001'
    };

    const mock_ai_engine = {
      evaluatePatternRelevance: jest.fn()
    };

    const error = expect(() => {
      confirmProposalValidity(
        existing_proposal,
        mock_ai_engine
      );
    }).toThrow(/PROPOSAL_ALREADY_VALIDATED/);

    expect(mock_ai_engine.evaluatePatternRelevance).not.toHaveBeenCalled();
    expect(existing_proposal.confirmation_status).toBe('VALIDATED');
  });
});