import { calculateProposalNeedsAlignmentScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-696
  test('提案資料と顧客ニーズの適合度スコア化機能 - 顧客ニーズが0件のとき、スコア計算が実行できない旨の結果が返される', () => {
    const proposalData = {
      proposalId: 'PROP-20240115-001',
      category: '営業ツール',
      budgetAmount: 500000,
      duration: 12,
      targetIndustry: '製造業',
    };

    const emptyCustomerNeeds: any[] = [];

    const result = calculateProposalNeedsAlignmentScore(
      proposalData,
      emptyCustomerNeeds
    );

    expect(result).toEqual({
      code: 'NO_CUSTOMER_NEEDS',
      message: 'スコア計算対象の顧客ニーズが見つかりません',
      score: null,
    });
  });
});