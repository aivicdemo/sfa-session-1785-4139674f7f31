import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { calculateProcessComplianceAndCorrelation } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1204
  it('should throw error when process definition is empty string', () => {
    const invalid_process_definition = '';
    const sales_activity_data = [
      {
        sales_rep_id: 'SR001',
        activity_type: 'initial_contact',
        customer_id: 'CUST001',
        contact_date: '2024-01-15T10:00:00Z',
        proposal_content: 'Product A proposal',
        follow_up_completed: true,
      },
    ];
    const contract_results = [
      {
        sales_rep_id: 'SR001',
        customer_id: 'CUST001',
        contract_status: 'won',
        contract_date: '2024-01-20T14:00:00Z',
      },
    ];

    expect(() =>
      calculateProcessComplianceAndCorrelation({
        process_definition: invalid_process_definition,
        sales_activity_data: sales_activity_data,
        contract_results: contract_results,
      })
    ).toThrow(/INVALID_PROCESS_DEFINITION/);
  });
});