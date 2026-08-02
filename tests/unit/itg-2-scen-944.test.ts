import { validateProposalContent } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-944
  test('提案内容検証機能 - 提案日付が不正な形式のとき検証エラーが返される', () => {
    const invalid_proposal_input = {
      proposal_date: '2024/13/45',
      proposal_content: 'test content',
      customer_id: 'CUST-001',
    };

    const result = validateProposalContent(invalid_proposal_input);

    expect(result.is_valid).toBe(false);
    expect(result.error_code).toBe('INVALID_PROPOSAL_DATE_FORMAT');
    expect(result.error_message).toMatch(/提案日付はYYYY-MM-DD形式である必要があります/);
    expect(result.errors).toBeDefined();
    expect(Array.isArray(result.errors)).toBe(true);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});