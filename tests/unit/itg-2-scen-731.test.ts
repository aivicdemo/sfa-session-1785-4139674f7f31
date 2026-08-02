import { calculateProposalNeedsAdherence } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-731
  test('提案資料がnullのとき、ERR_PROPOSAL_NULLエラーが発生する', () => {
    const proposal_material = null;
    const customer_needs = {
      budget_amount: 1000000,
      implementation_period_months: 3,
    };

    expect(() => {
      calculateProposalNeedsAdherence(proposal_material, customer_needs);
    }).toThrow(/提案資料は必須項目です/);
  });
});