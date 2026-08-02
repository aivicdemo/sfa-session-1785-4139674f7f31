import { validateProposalContent } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-950
  test('提案タイトルが最大文字数より1文字少ないとき検証に成功する', () => {
    const maxTitleLength = 255;
    const titleWith254Chars = 'a'.repeat(254);

    const proposalContent = {
      title: titleWith254Chars,
    };

    const result = validateProposalContent(proposalContent);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });
});