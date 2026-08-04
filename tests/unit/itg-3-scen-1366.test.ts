import { calculateImplementationFeasibilityScore } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1366
  test('[error] 実装可能性スコア算出機能 - 提案金額が0以下のとき実装可能性スコア計算がエラーになる', () => {
    const input = {
      proposalAmount: 0,
      customerBudget: 1000000,
      implementationPeriodDays: 30,
      riskFactors: [],
    };

    const result = calculateImplementationFeasibilityScore(input);

    expect(result).toEqual({
      score: null,
      error: {
        code: 'INVALID_PROPOSAL_AMOUNT',
        message: '提案金額は1以上の値を設定してください',
      },
    });
  });
});