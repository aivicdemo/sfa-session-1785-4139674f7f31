import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-706
  test('[error] 成約実績の営業担当者IDが分析対象者と不一致のとき紐付け整合性エラーになる', () => {
    const sales_rep_master = [
      {
        sales_rep_id: 'SA001',
        name: '田中太郎',
        department: '営業部',
        hire_date: '2020-04-01'
      }
    ];

    const contract_results = [
      {
        contract_id: 'CTR001',
        sales_rep_id: 'SA002',
        contract_amount: 500000,
        contract_date: '2024-01-15',
        customer_id: 'CUST001'
      }
    ];

    const target_sales_rep_id = 'SA001';

    expect(() =>
      generateSalesRepBehaviorAnalysisReport({
        sales_rep_master: sales_rep_master,
        contract_results: contract_results,
        target_sales_rep_id: target_sales_rep_id
      })
    ).toThrow(/紐付け/);
  });
});