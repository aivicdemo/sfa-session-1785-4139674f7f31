import { validateProposalExecution } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-403
  test('提案実行レコードに必須属性（提案内容）が欠落している場合、エラーとして処理される', () => {
    const proposal_id = 'PROP-2024-001';
    const execution_date = new Date('2024-02-15T09:30:00Z');
    const sales_rep_id = 'REP-0001';
    const proposal_content = null;

    expect(() =>
      validateProposalExecution({
        proposal_id,
        execution_date,
        sales_rep_id,
        proposal_content,
      })
    ).toThrow(/提案内容/);
  });
});