import { validateProposalRecord } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1005
  test('提案・顧客対応記録の必須項目検証 - 必須項目が空文字列の場合に入力が受け付けられず警告が表示される', () => {
    const input_proposal_record = {
      project_name: '',
      customer_name: 'テスト顧客',
      response_content: '対応内容',
    };

    expect(() => validateProposalRecord(input_proposal_record)).toThrow(/必須項目/);
  });
});