import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateProcessCorrelationCoefficient } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1084: [edge] 行動パターン分析対象指標の自動選定機能 - 月をまたぐ営業プロセスの相関分析が正確に計算される
  test('月をまたぐ期間の営業プロセスデータから相関係数が正確に計算される', () => {
    // 前月（11月）1日〜30日のデータ
    const november_data = [
      { date: '2024-11-01', contact_count: 5, proposal_count: 2, contract_count: 1 },
      { date: '2024-11-02', contact_count: 6, proposal_count: 3, contract_count: 1 },
      { date: '2024-11-03', contact_count: 4, proposal_count: 2, contract_count: 0 },
      { date: '2024-11-04', contact_count: 7, proposal_count: 3, contract_count: 2 },
      { date: '2024-11-05', contact_count: 8, proposal_count: 4, contract_count: 2 },
      { date: '2024-11-06', contact_count: 3, proposal_count: 1, contract_count: 0 },
      { date: '2024-11-07', contact_count: 6, proposal_count: 3, contract_count: 1 },
      { date: '2024-11-08', contact_count: 9, proposal_count: 4, contract_count: 2 },
      { date: '2024-11-09', contact_count: 5, proposal_count: 2, contract_count: 1 },
      { date: '2024-11-10', contact_count: 7, proposal_count: 3, contract_count: 2 },
      { date: '2024-11-11', contact_count: 4, proposal_count: 2, contract_count: 1 },
      { date: '2024-11-12', contact_count: 8, proposal_count: 4, contract_count: 2 },
      { date: '2024-11-13', contact_count: 6, proposal_count: 3, contract_count: 1 },
      { date: '2024-11-14', contact_count: 5, proposal_count: 2, contract_count: 1 },
      { date: '2024-11-15', contact_count: 9, proposal_count: 4, contract_count: 2 },
      { date: '2024-11-16', contact_count: 3, proposal_count: 1, contract_count: 0 },
      { date: '2024-11-17', contact_count: 7, proposal_count: 3, contract_count: 2 },
      { date: '2024-11-18', contact_count: 4, proposal_count: 2, contract_count: 1 },
      { date: '2024-11-19', contact_count: 6, proposal_count: 3, contract_count: 1 },
      { date: '2024-11-20', contact_count: 8, proposal_count: 4, contract_count: 2 },
      { date: '2024-11-21', contact_count: 5, proposal_count: 2, contract_count: 1 },
      { date: '2024-11-22', contact_count: 7, proposal_count: 3, contract_count: 2 },
      { date: '2024-11-23', contact_count: 4, proposal_count: 2, contract_count: 0 },
      { date: '2024-11-24', contact_count: 9, proposal_count: 4, contract_count: 2 },
      { date: '2024-11-25', contact_count: 6, proposal_count: 3, contract_count: 1 },
      { date: '2024-11-26', contact_count: 3, proposal_count: 1, contract_count: 0 },
      { date: '2024-11-27', contact_count: 8, proposal_count: 4, contract_count: 2 },
      { date: '2024-11-28', contact_count: 5, proposal_count: 2, contract_count: 1 },
      { date: '2024-11-29', contact_count: 7, proposal_count: 3, contract_count: 2 },
      { date: '2024-11-30', contact_count: 4, proposal_count: 2, contract_count: 1 },
    ];

    // 当月（12月）1日〜15日のデータ
    const december_data = [
      { date: '2024-12-01', contact_count: 6, proposal_count: 3, contract_count: 1 },
      { date: '2024-12-02', contact_count: 9, proposal_count: 4, contract_count: 2 },
      { date: '2024-12-03', contact_count: 5, proposal_count: 2, contract_count: 1 },
      { date: '2024-12-04', contact_count: 7, proposal_count: 3, contract_count: 2 },
      { date: '2024-12-05', contact_count: 4, proposal_count: 2, contract_count: 0 },
      { date: '2024-12-06', contact_count: 8, proposal_count: 4, contract_count: 2 },
      { date: '2024-12-07', contact_count: 6, proposal_count: 3, contract_count: 1 },
      { date: '2024-12-08', contact_count: 3, proposal_count: 1, contract_count: 0 },
      { date: '2024-12-09', contact_count: 9, proposal_count: 4, contract_count: 2 },
      { date: '2024-12-10', contact_count: 5, proposal_count: 2, contract_count: 1 },
      { date: '2024-12-11', contact_count: 7, proposal_count: 3, contract_count: 2 },
      { date: '2024-12-12', contact_count: 4, proposal_count: 2, contract_count: 1 },
      { date: '2024-12-13', contact_count: 8, proposal_count: 4, contract_count: 2 },
      { date: '2024-12-14', contact_count: 6, proposal_count: 3, contract_count: 1 },
      { date: '2024-12-15', contact_count: 3, proposal_count: 1, contract_count: 0 },
    ];

    const combined_dataset = [...november_data, ...december_data];

    const result = calculateProcessCorrelationCoefficient({
      process_data: combined_dataset,
      start_date: '2024-11-01',
      end_date: '2024-12-15',
      metric_1: 'contact_count',
      metric_2: 'contract_count',
    });

    expect(result).toHaveProperty('correlation_coefficient');
    expect(result).toHaveProperty('selected_metrics');
    expect(result).toHaveProperty('data_point_count');
    expect(result).toHaveProperty('analysis_period');

    expect(result.data_point_count).toBe(45);

    expect(result.selected_metrics).toEqual(['contact_count', 'contract_count']);

    expect(result.analysis_period).toEqual({
      start_date: '2024-11-01',
      end_date: '2024-12-15',
      total_days: 45,
    });

    expect(typeof result.correlation_coefficient).toBe('number');
    expect(result.correlation_coefficient).toBeGreaterThanOrEqual(0.77);
    expect(result.correlation_coefficient).toBeLessThanOrEqual(0.79);

    expect(result.correlation_coefficient).toBeCloseTo(0.78, 2);
  });
});