import { detectAbnormalPattern } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-670
  test('提案内容データが空文字列のとき異常パターン検出処理がエラーを返す', () => {
    const input = {
      proposal_content: '',
      sales_rep_id: 'SR001',
      customer_id: 'CUST001',
      deal_amount: 100000,
      deal_stage: '提案',
    };

    const result = detectAbnormalPattern(input);

    expect(result.error_code).toBe('ERR_EMPTY_PROPOSAL_CONTENT');
    expect(result.error_message).toBe(
      '提案内容が空文字列のため異常パターン分析を実行できません'
    );
    expect(result.success).toBe(false);
  });
});