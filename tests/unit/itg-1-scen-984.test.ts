import { extractAndApproveSuccessFailureFactors } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-984
  test('営業管理職IDがnullのとき、操作者特定ができずエラーになる', () => {
    const input = {
      sales_manager_id: null,
      case_data: {
        case_id: 'CASE-001',
        success_factors: ['factor1', 'factor2'],
        failure_factors: ['risk1', 'risk2'],
        deal_amount: 500000,
        customer_segment: 'enterprise',
        industry: 'manufacturing'
      },
      extraction_parameters: {
        include_context: true,
        min_confidence_score: 0.75,
        target_period_start: '2024-01-01',
        target_period_end: '2024-01-31'
      }
    };

    const result = extractAndApproveSuccessFailureFactors(input);

    expect(result).toEqual({
      success: false,
      error_code: 'SALES_MANAGER_ID_NOT_FOUND',
      error_message: '操作者である営業管理職が特定できません',
      extracted_factors: null,
      approval_status: null,
      extraction_executed: false
    });
  });
});