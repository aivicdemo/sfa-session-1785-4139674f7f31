import { calculateSuccessPatternMatrixApplicability } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-389: 営業担当者IDが0の場合、INVALID_SALES_PERSON_IDエラーをスロー', () => {
    const invalid_sales_person_id = 0;
    const customer_attributes = {
      industry: 'manufacturing',
      company_size: 'large',
      annual_revenue: 50000000,
    };
    const deal_stage = 'proposal';
    const issue_pattern = 'cost_reduction';

    expect(() =>
      calculateSuccessPatternMatrixApplicability(
        invalid_sales_person_id,
        customer_attributes,
        deal_stage,
        issue_pattern
      )
    ).toThrow(/INVALID_SALES_PERSON_ID/);
  });
});