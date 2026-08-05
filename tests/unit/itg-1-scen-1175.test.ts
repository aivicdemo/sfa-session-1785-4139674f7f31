import { runTx12Imp1Agent, Tx12Imp1AiClient } from '../../src/logic/it-1-br-2-1-1';

describe('成約実績との相関分析機能', () => {
  // SCEN-1175
  test('プロセスステップ実行度と成約率に相関がない場合、相関係数が0に近い値として計算される', async () => {
    // テストデータセット: プロセスステップ実行度と成約率の相関がない
    // 過去6ヶ月分、営業担当者10名、各月30件以上の商談記録
    const test_dataset_id = 'dataset_20240115_no_correlation';
    const sales_rep_count = 10;
    const deals_per_month = 30;
    const total_deals = sales_rep_count * 6 * deals_per_month; // 1800件

    const mock_test_data = [
      { sales_rep_id: 'rep_001', process_step_execution_score: 90, closing_rate: 0.35, sample_size: 180 },
      { sales_rep_id: 'rep_002', process_step_execution_score: 40, closing_rate: 0.38, sample_size: 180 },
      { sales_rep_id: 'rep_003', process_step_execution_score: 85, closing_rate: 0.32, sample_size: 180 },
      { sales_rep_id: 'rep_004', process_step_execution_score: 45, closing_rate: 0.36, sample_size: 180 },
      { sales_rep_id: 'rep_005', process_step_execution_score: 75, closing_rate: 0.34, sample_size: 180 },
      { sales_rep_id: 'rep_006', process_step_execution_score: 50, closing_rate: 0.37, sample_size: 180 },
      { sales_rep_id: 'rep_007', process_step_execution_score: 88, closing_rate: 0.33, sample_size: 180 },
      { sales_rep_id: 'rep_008', process_step_execution_score: 42, closing_rate: 0.39, sample_size: 180 },
      { sales_rep_id: 'rep_009', process_step_execution_score: 70, closing_rate: 0.35, sample_size: 180 },
      { sales_rep_id: 'rep_010', process_step_execution_score: 55, closing_rate: 0.36, sample_size: 180 },
    ];

    // フェイクAIクライアントを注入
    const fake_ai_client: Tx12Imp1AiClient = {
      analyzeCorrelationBetweenProcessExecutionAndClosingRate: jest.fn().mockResolvedValue({
        correlation_coefficient: 0.18,
        dataset_identifier: test_dataset_id,
        analysis_period_months: 6,
        sample_size_sales_reps: sales_rep_count,
        sample_size_deals: total_deals,
        algorithm_name: 'Pearson',
        calculation_timestamp: new Date('2024-01-15T10:00:00Z'),
        analysis_conclusion: 'プロセスステップ実行度と成約率の間に有意な相関は認められない',
        dataset_records: mock_test_data,
      }),
    };

    // runTx12Imp1Agent()を呼び出し
    const result = await runTx12Imp1Agent(
      {
        target_period_months: 6,
        sales_team_data: mock_test_data,
        dataset_id: test_dataset_id,
      },
      fake_ai_client,
    );

    // 相関係数が-0.3から+0.3の範囲内（±0.25以下）であることを確認
    expect(result.correlation_coefficient).toBeGreaterThanOrEqual(-0.25);
    expect(result.correlation_coefficient).toBeLessThanOrEqual(0.25);

    // レポートオブジェクトに必要な情報が記録されていることを確認
    expect(result.dataset_identifier).toBe(test_dataset_id);
    expect(result.analysis_period_months).toBe(6);
    expect(result.sample_size_sales_reps).toBe(sales_rep_count);
    expect(result.sample_size_deals).toBe(total_deals);
    expect(result.algorithm_name).toBe('Pearson');
    expect(result.calculation_timestamp).toEqual(new Date('2024-01-15T10:00:00Z'));
    expect(result.analysis_conclusion).toBe('プロセスステップ実行度と成約率の間に有意な相関は認められない');

    // 計算に使用されたデータセット情報が記録されていることを確認
    expect(result.dataset_records).toHaveLength(sales_rep_count);
    expect(result.dataset_records[0]).toHaveProperty('sales_rep_id');
    expect(result.dataset_records[0]).toHaveProperty('process_step_execution_score');
    expect(result.dataset_records[0]).toHaveProperty('closing_rate');
    expect(result.dataset_records[0]).toHaveProperty('sample_size');

    // AIクライアントが正しく呼び出されたことを確認
    expect(fake_ai_client.analyzeCorrelationBetweenProcessExecutionAndClosingRate).toHaveBeenCalledWith(
      expect.objectContaining({
        target_period_months: 6,
        dataset_id: test_dataset_id,
        sales_team_data: mock_test_data,
      }),
    );
  });
});