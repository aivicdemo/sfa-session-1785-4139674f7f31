import { validateProposalAmount } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-939
  test('提案金額が正の整数のとき形式検証に成功する', () => {
    const proposalAmount = 50000;

    const result = validateProposalAmount(proposalAmount);

    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBe('');
  });
});