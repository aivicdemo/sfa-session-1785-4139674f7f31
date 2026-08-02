import { validateProposalContent } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-954
  test('提案内容説明が最大文字数より1文字少ないとき検証に成功する', () => {
    const MAX_DESCRIPTION_LENGTH = 1000;
    const descriptionLength = MAX_DESCRIPTION_LENGTH - 1;
    const proposalDescription = 'a'.repeat(descriptionLength);

    const result = validateProposalContent({
      description: proposalDescription,
      maxLength: MAX_DESCRIPTION_LENGTH,
    });

    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeUndefined();
  });
});