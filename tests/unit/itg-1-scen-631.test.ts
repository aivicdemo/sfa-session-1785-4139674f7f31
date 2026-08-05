import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-631
  test('成約実績データが欠落しているときエラーになる', () => {
    const sales_person_id = 'EMP001';
    const interaction_date = new Date('2024-01-10T09:00:00Z');
    const proposal_date = new Date('2024-01-15T10:00:00Z');
    const contract_date = null;
    const contract_amount = null;
    const contract_type = null;

    const test_input = {
      sales_person_id: sales_person_id,
      interactions: [
        {
          interaction_id: 'INT001',
          customer_id: 'CUST001',
          interaction_date: interaction_date,
          interaction_type: 'initial_contact',
        },
      ],
      proposals: [
        {
          proposal_id: 'PROP001',
          customer_id: 'CUST001',
          proposal_date: proposal_date,
          proposal_content: 'Product A proposal',
        },
      ],
      contract_results: [
        {
          contract_id: 'CNT001',
          customer_id: 'CUST001',
          contract_date: contract_date,
          contract_amount: contract_amount,
          contract_type: contract_type,
        },
      ],
    };

    expect(() => generateSalesPersonBehaviorAnalysisReport(test_input)).toThrow(
      /成約実績/,
    );
  });
});