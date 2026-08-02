import { validateProposalAmount } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客購買検討データ入力検証機能 - 提案金額の端数検証', () => {
  // SCEN-919
  test('提案金額が小数第3位を含むとき端数エラーを検出する', () => {
    const proposalData = {
      proposal_amount: 12345.678,
    };

    const result = validateProposalAmount(proposalData.proposal_amount);

    expect(result).toEqual({
      is_valid: false,
      error_code: 'PROPOSAL_AMOUNT_PRECISION_INVALID',
      error_message: '提案金額は小数第2位までで入力してください',
    });
  });
});