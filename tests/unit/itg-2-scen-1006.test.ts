import { validateProposalRecord } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-1006
  test('提案・顧客対応記録の必須項目検証 - 必須項目がnullの場合に入力が受け付けられず警告が表示される', () => {
    const proposalRecord = {
      customer_name: null,
      response_content: '初回訪問対応',
      response_datetime: '2024-01-15T10:00:00Z',
      sales_staff_id: 'STAFF001',
    };

    expect(() => validateProposalRecord(proposalRecord)).toThrow(/必須項目/);
  });
});