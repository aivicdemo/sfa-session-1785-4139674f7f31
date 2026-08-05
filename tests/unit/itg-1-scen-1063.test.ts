import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析指標自動選定機能', () => {
  // SCEN-1063
  test('営業プロセス標準書が定義済みで成約実績との相関が計算可能な場合、指標の優先度順に並んだリストが返される', () => {
    const sales_process_definition = [
      {
        stage_id: 'stage_001',
        stage_name: '初回接触',
        standard_activity: '初回訪問',
      },
      {
        stage_id: 'stage_002',
        stage_name: 'ニーズ把握',
        standard_activity: 'ニーズヒアリング',
      },
      {
        stage_id: 'stage_003',
        stage_name: '提案',
        standard_activity: '提案資料作成',
      },
      {
        stage_id: 'stage_004',
        stage_name: '交渉',
        standard_activity: '見積提示',
      },
      {
        stage_id: 'stage_005',
        stage_name: '成約',
        standard_activity: '契約締結',
      },
    ];

    const sales_performance_data = {
      contracted_count: 150,
      non_contracted_count: 50,
      total_deals: 200,
    };

    const correlation_data = [
      {
        indicator_name: '提案資料作成',
        correlation_coefficient: 0.87,
      },
      {
        indicator_name: '初回訪問',
        correlation_coefficient: 0.76,
      },
      {
        indicator_name: 'ニーズヒアリング',
        correlation_coefficient: 0.64,
      },
      {
        indicator_name: '見積提示',
        correlation_coefficient: 0.58,
      },
      {
        indicator_name: '契約締結',
        correlation_coefficient: 0.45,
      },
    ];

    const result = selectAnalysisIndicators(
      sales_process_definition,
      sales_performance_data,
      correlation_data
    );

    expect(result).toEqual([
      {
        indicator_name: '提案資料作成',
        correlation_coefficient: 0.87,
        priority: 1,
      },
      {
        indicator_name: '初回訪問',
        correlation_coefficient: 0.76,
        priority: 2,
      },
      {
        indicator_name: 'ニーズヒアリング',
        correlation_coefficient: 0.64,
        priority: 3,
      },
      {
        indicator_name: '見積提示',
        correlation_coefficient: 0.58,
        priority: 4,
      },
      {
        indicator_name: '契約締結',
        correlation_coefficient: 0.45,
        priority: 5,
      },
    ]);

    expect(result[0].correlation_coefficient).toBeGreaterThan(
      result[1].correlation_coefficient
    );
    expect(result[1].correlation_coefficient).toBeGreaterThan(
      result[2].correlation_coefficient
    );
    expect(result.length).toBe(5);
    expect(result.every((item) => item.priority >= 1)).toBe(true);
  });
});