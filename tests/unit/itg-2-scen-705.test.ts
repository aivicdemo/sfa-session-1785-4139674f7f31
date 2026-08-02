import { calculateIndustryMatchScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-705
  test('提案資料と顧客ニーズの適合度スコア化機能 - 顧客業種が空のとき、業種適合スコア計算が適切に処理される', () => {
    const customerInfo = {
      id: 'cust-001',
      name: '顧客A',
      industry: '',
    };

    const proposalDocument = {
      id: 'prop-001',
      targetIndustry: '製造業',
      content: 'サンプル提案内容',
    };

    const result = calculateIndustryMatchScore(customerInfo, proposalDocument);

    expect(result.score).toBe(0);
    expect(result.reason).toBe('顧客業種が未設定のため計算不可');
  });
});