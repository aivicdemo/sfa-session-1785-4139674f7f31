import { validateProposalRecord } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1002
  test('提案・顧客対応記録の必須項目検証 - 対応内容が空の場合に入力が受け付けられず警告が表示される', () => {
    const proposalRecord = {
      customer_name: '株式会社ABC',
      contact_date_time: '2024-01-15T14:30:00Z',
      response_content: '',
      follow_up_status: 'pending',
    };

    expect(() => validateProposalRecord(proposalRecord)).toThrow(/対応内容/);
  });
});