import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { calculateSalesPersonBehaviorPattern } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-285: [error] 営業担当者行動パターン分析・改善指導判定機能 - 月次モニタリング集計期間の終了日が null のとき、処理が中断される
  it('should throw error with code INVALID_AGGREGATION_PERIOD_END_DATE when aggregation period end date is null', () => {
    const aggregation_period_start_date = '2024-01-01';
    const aggregation_period_end_date = null;
    const sales_person_id = 'SP001';
    const behavioral_data_list = [
      {
        activity_date: '2024-01-05',
        activity_type: 'initial_contact',
        result_code: 'success'
      },
      {
        activity_date: '2024-01-10',
        activity_type: 'proposal',
        result_code: 'success'
      }
    ];

    expect(() => {
      calculateSalesPersonBehaviorPattern({
        aggregation_period_start_date,
        aggregation_period_end_date,
        sales_person_id,
        behavioral_data_list
      });
    }).toThrow(/集計期間の終了日が未設定です/);
  });
});