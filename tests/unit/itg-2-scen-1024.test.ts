import { validateProposalContentDateFormat } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1024
  test('提案内容の提案日付が有効な日付形式である場合に形式検証が成功する', () => {
    const proposal_content = {
      proposal_date: '2024-01-15',
    };

    const result = validateProposalContentDateFormat(proposal_content);

    expect(result.validation_status).toBe('VALID');
    expect(result.error_messages).toEqual([]);
    expect(result.field_validation_status).toBe('VALID');
  });
});