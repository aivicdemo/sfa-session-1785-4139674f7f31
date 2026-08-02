import { validateProposalContent } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-958
  test('提案カテゴリが指定される場合、提案内容が必須チェック対象となり、空白時はバリデーションエラーを返す', () => {
    const input = {
      proposalCategory: '製品提案',
      proposalContent: '',
    };

    expect(() => validateProposalContent(input)).toThrow(/提案内容/);
  });
});