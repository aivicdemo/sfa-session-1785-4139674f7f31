import { validateProposalDescription } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-952
  test('提案内容説明が最大文字数を超えるとき検証エラーが返される', () => {
    const exceeds_max_length_text = 'a'.repeat(5001);
    const proposal_content = {
      proposal_description: exceeds_max_length_text,
    };

    const validation_result = validateProposalDescription(proposal_content);

    expect(validation_result.is_valid).toBe(false);
    expect(validation_result.error_code).toBe('PROPOSAL_DESCRIPTION_EXCEEDS_MAX_LENGTH');
    expect(validation_result.error_message).toBe(
      '提案内容説明は5000文字以内で入力してください。現在の文字数: 5001文字'
    );
  });
});