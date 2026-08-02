import { validateProposalContent } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-948
  test('提案タイトルが最大文字数を超えるとき検証エラーが返される', () => {
    const title_exceeds_max = 'a'.repeat(251);
    const proposal_content = {
      proposalTitle: title_exceeds_max,
      proposalDescription: 'test description',
      customerSegment: 'enterprise',
    };

    const error_result = validateProposalContent(proposal_content);

    expect(error_result).toEqual({
      errorCode: 'TITLE_EXCEEDS_MAX_LENGTH',
      errorMessage: '提案タイトルは250文字以内である必要があります',
      errorLevel: 'validation_error',
      affectedField: 'proposalTitle',
    });
  });
});