import { extractSuccessFactors } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-972
  test('成功要因が空配列のとき、ERR_EMPTY_SUCCESS_FACTORSエラーを返す', () => {
    const sales_case_data = {
      case_id: 'CASE_001',
      sales_rep_id: 'REP_001',
      customer_id: 'CUST_001',
      proposal_content: '提案内容サンプル',
      customer_response: '顧客反応サンプル',
      contract_result: true,
      contract_date: '2024-01-15'
    };

    expect(() => extractSuccessFactors(sales_case_data)).toThrow(/ERR_EMPTY_SUCCESS_FACTORS/);
  });
});