import { calculateProposalNeedsAlignmentScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-707
  test('[normal] 提案資料と顧客ニーズの適合度スコア化機能 - 顧客規模が完全に一致するとき、規模適合スコアが最高値になる', () => {
    const customer_needs = {
      customer_id: 'CUST-001',
      employee_count: 1000,
    };

    const proposal_document = {
      proposal_id: 'PROP-001',
      target_company_size: 1000,
    };

    const result = calculateProposalNeedsAlignmentScore(
      customer_needs,
      proposal_document
    );

    expect(result.size_alignment_score).toBe(100);
  });
});