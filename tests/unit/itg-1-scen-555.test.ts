import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesPerformanceAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-555
  it('[error] 営業担当者ごとの行動パターン分析レポート生成機能 - 成約実績の成約金額が欠落している場合、エラーになる', () => {
    const sales_rep_id = 'SR_001';
    const sales_rep_name = '営業太郎';
    const sales_rep_department = '東京営業部';
    
    const contract_result_id = 'CR_001';
    const contract_result_deal_id = 'D_001';
    const contract_result_customer_id = 'C_001';
    const contract_result_contract_date = '2024-01-15';
    const contract_result_contract_amount = null;
    const contract_result_status = 'completed';
    
    const sales_activity_id = 'SA_001';
    const sales_activity_deal_id = 'D_001';
    const sales_activity_sales_rep_id = 'SR_001';
    const sales_activity_activity_type = 'proposal';
    const sales_activity_activity_date = '2024-01-10';
    const sales_activity_contact_frequency = 3;
    
    const input_data = {
      sales_rep: {
        sales_rep_id: sales_rep_id,
        sales_rep_name: sales_rep_name,
        sales_rep_department: sales_rep_department,
      },
      contract_results: [
        {
          contract_result_id: contract_result_id,
          contract_result_deal_id: contract_result_deal_id,
          contract_result_customer_id: contract_result_customer_id,
          contract_result_contract_date: contract_result_contract_date,
          contract_result_contract_amount: contract_result_contract_amount,
          contract_result_status: contract_result_status,
        },
      ],
      sales_activities: [
        {
          sales_activity_id: sales_activity_id,
          sales_activity_deal_id: sales_activity_deal_id,
          sales_activity_sales_rep_id: sales_activity_sales_rep_id,
          sales_activity_activity_type: sales_activity_activity_type,
          sales_activity_activity_date: sales_activity_activity_date,
          sales_activity_contact_frequency: sales_activity_contact_frequency,
        },
      ],
      analysis_period_start: '2024-01-01',
      analysis_period_end: '2024-01-31',
    };

    expect(() => generateSalesPerformanceAnalysisReport(input_data)).toThrow(/成約金額/);
  });
});