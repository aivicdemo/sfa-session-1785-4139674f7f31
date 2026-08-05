import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1036
  test('成約実績データが0件のとき成約実績分析がエラーになること', () => {
    const sales_person_id = 'SP_001';
    const analysis_month = '2024-01';
    const contract_records: any[] = [];
    const behavior_logs = [
      {
        log_id: 'BL_001',
        sales_person_id: 'SP_001',
        activity_type: 'visit',
        customer_id: 'C_001',
        activity_date: '2024-01-10',
        activity_details: 'Initial contact',
      },
      {
        log_id: 'BL_002',
        sales_person_id: 'SP_001',
        activity_type: 'proposal',
        customer_id: 'C_001',
        activity_date: '2024-01-15',
        activity_details: 'Proposal sent',
      },
    ];
    const process_definition = {
      stage_1: 'initial_contact',
      stage_2: 'proposal',
      stage_3: 'negotiation',
      stage_4: 'contract',
    };

    expect(() =>
      generateSalesPersonBehaviorAnalysisReport({
        sales_person_id,
        analysis_month,
        contract_records,
        behavior_logs,
        process_definition,
      })
    ).toThrow(/成約実績データ/);
  });
});