import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { analyzeAndGenerateBehaviorPatternReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-551
  test('活動日時が欠落している営業活動ログレコードが検出されたとき、ValidationError を発生させる', () => {
    const sales_staff_id_1 = 'SALES_001';
    const sales_staff_id_2 = 'SALES_002';
    const activity_log_id_valid = 'ACT_LOG_001';
    const activity_log_id_invalid = 'ACT_LOG_002';
    const customer_id_1 = 'CUST_001';
    const deal_id_1 = 'DEAL_001';

    const activity_logs = [
      {
        activity_log_id: activity_log_id_valid,
        sales_staff_id: sales_staff_id_1,
        customer_id: customer_id_1,
        activity_type: 'initial_contact',
        activity_date_time: new Date('2024-01-15T10:00:00Z'),
        contact_method: 'phone',
        notes: 'Initial contact successful',
      },
      {
        activity_log_id: activity_log_id_invalid,
        sales_staff_id: sales_staff_id_2,
        customer_id: customer_id_1,
        activity_type: 'proposal',
        activity_date_time: null,
        contact_method: 'email',
        notes: 'Proposal sent',
      },
    ];

    const deal_records = [
      {
        deal_id: deal_id_1,
        sales_staff_id: sales_staff_id_1,
        customer_id: customer_id_1,
        deal_status: 'won',
        deal_amount: 100000,
        deal_close_date: new Date('2024-01-20T17:00:00Z'),
      },
    ];

    const process_definition = {
      steps: [
        { step_sequence: 1, step_name: 'initial_contact' },
        { step_sequence: 2, step_name: 'proposal' },
        { step_sequence: 3, step_name: 'negotiation' },
        { step_sequence: 4, step_name: 'close' },
      ],
    };

    expect(() => {
      analyzeAndGenerateBehaviorPatternReport({
        activity_logs,
        deal_records,
        process_definition,
      });
    }).toThrow(/活動日時/);
  });
});