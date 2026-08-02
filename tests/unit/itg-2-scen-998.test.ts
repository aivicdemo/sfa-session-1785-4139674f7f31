import { validateProposalRecord } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 提案・顧客対応記録の必須項目検証', () => {
  // SCEN-998
  test('提案日時が空の場合に入力が受け付けられず警告が表示される', () => {
    const proposalRecord = {
      customer_name: 'テスト太郎',
      response_content: '製品Aの導入提案',
      proposal_datetime: '',
    };

    const result = validateProposalRecord(proposalRecord);

    expect(result.is_valid).toBe(false);
    expect(result.error_message).toMatch(/提案日時/);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'proposal_datetime',
          message: expect.stringMatching(/提案日時は必須項目です/),
        }),
      ])
    );
    expect(result.submit_enabled).toBe(false);
  });
});