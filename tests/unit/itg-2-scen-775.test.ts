import { analyzeSalesProcessExecution } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-775
  test('営業担当者が0件の商談記録を持つ場合、行動パターン分析が空結果として返される', async () => {
    const user_id = 'salesperson_A';
    const deal_records = [];

    const result = await analyzeSalesProcessExecution({
      user_id,
      deal_records,
    });

    expect(result.analysis_patterns).toEqual([]);
    expect(result.graph_data).toBeNull();
    expect(result.statistics_summary).toEqual({
      average_value: null,
      maximum_value: null,
      minimum_value: null,
    });
    expect(result.status_code).toBe(200);
    expect(result.error_flag).toBe(false);
  });
});