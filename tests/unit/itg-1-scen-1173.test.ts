import { analyzeCorrelationWithSalesResults } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-1173: [normal] 成約実績との相関分析機能 - プロセスステップ実行度と成約率の正の相関が検出される場合、可視化データに正の相関値が含まれる
  test('成約実績と営業プロセスステップ実行度の間に正の相関が存在する場合、可視化データに相関係数0.75以上が含まれること', () => {
    // テストデータ: 過去12ヶ月分の営業担当者別成約実績データ
    const sales_results_data = [
      {
        sales_rep_id: 'rep_001',
        month: '2024-01',
        contract_count: 5,
        contract_amount: 2500000,
        contract_date: '2024-01-15'
      },
      {
        sales_rep_id: 'rep_001',
        month: '2024-02',
        contract_count: 7,
        contract_amount: 3500000,
        contract_date: '2024-02-20'
      },
      {
        sales_rep_id: 'rep_001',
        month: '2024-03',
        contract_count: 6,
        contract_amount: 3000000,
        contract_date: '2024-03-18'
      },
      {
        sales_rep_id: 'rep_001',
        month: '2024-04',
        contract_count: 8,
        contract_amount: 4000000,
        contract_date: '2024-04-22'
      },
      {
        sales_rep_id: 'rep_001',
        month: '2024-05',
        contract_count: 9,
        contract_amount: 4500000,
        contract_date: '2024-05-25'
      },
      {
        sales_rep_id: 'rep_001',
        month: '2024-06',
        contract_count: 10,
        contract_amount: 5000000,
        contract_date: '2024-06-28'
      },
      {
        sales_rep_id: 'rep_002',
        month: '2024-01',
        contract_count: 3,
        contract_amount: 1500000,
        contract_date: '2024-01-10'
      },
      {
        sales_rep_id: 'rep_002',
        month: '2024-02',
        contract_count: 4,
        contract_amount: 2000000,
        contract_date: '2024-02-15'
      },
      {
        sales_rep_id: 'rep_002',
        month: '2024-03',
        contract_count: 5,
        contract_amount: 2500000,
        contract_date: '2024-03-20'
      },
      {
        sales_rep_id: 'rep_002',
        month: '2024-04',
        contract_count: 6,
        contract_amount: 3000000,
        contract_date: '2024-04-25'
      },
      {
        sales_rep_id: 'rep_002',
        month: '2024-05',
        contract_count: 7,
        contract_amount: 3500000,
        contract_date: '2024-05-28'
      },
      {
        sales_rep_id: 'rep_002',
        month: '2024-06',
        contract_count: 8,
        contract_amount: 4000000,
        contract_date: '2024-06-30'
      }
    ];

    // テストデータ: 同期間の営業プロセスステップ実行度データ
    const process_step_execution_data = [
      {
        sales_rep_id: 'rep_001',
        month: '2024-01',
        initial_contact_rate: 0.85,
        proposal_submission_rate: 0.75,
        followup_count: 8,
        contract_preparation_rate: 0.70
      },
      {
        sales_rep_id: 'rep_001',
        month: '2024-02',
        initial_contact_rate: 0.88,
        proposal_submission_rate: 0.80,
        followup_count: 10,
        contract_preparation_rate: 0.75
      },
      {
        sales_rep_id: 'rep_001',
        month: '2024-03',
        initial_contact_rate: 0.82,
        proposal_submission_rate: 0.78,
        followup_count: 9,
        contract_preparation_rate: 0.72
      },
      {
        sales_rep_id: 'rep_001',
        month: '2024-04',
        initial_contact_rate: 0.90,
        proposal_submission_rate: 0.85,
        followup_count: 12,
        contract_preparation_rate: 0.80
      },
      {
        sales_rep_id: 'rep_001',
        month: '2024-05',
        initial_contact_rate: 0.92,
        proposal_submission_rate: 0.88,
        followup_count: 13,
        contract_preparation_rate: 0.82
      },
      {
        sales_rep_id: 'rep_001',
        month: '2024-06',
        initial_contact_rate: 0.95,
        proposal_submission_rate: 0.90,
        followup_count: 15,
        contract_preparation_rate: 0.85
      },
      {
        sales_rep_id: 'rep_002',
        month: '2024-01',
        initial_contact_rate: 0.70,
        proposal_submission_rate: 0.60,
        followup_count: 5,
        contract_preparation_rate: 0.50
      },
      {
        sales_rep_id: 'rep_002',
        month: '2024-02',
        initial_contact_rate: 0.72,
        proposal_submission_rate: 0.62,
        followup_count: 6,
        contract_preparation_rate: 0.52
      },
      {
        sales_rep_id: 'rep_002',
        month: '2024-03',
        initial_contact_rate: 0.75,
        proposal_submission_rate: 0.65,
        followup_count: 7,
        contract_preparation_rate: 0.55
      },
      {
        sales_rep_id: 'rep_002',
        month: '2024-04',
        initial_contact_rate: 0.78,
        proposal_submission_rate: 0.68,
        followup_count: 8,
        contract_preparation_rate: 0.58
      },
      {
        sales_rep_id: 'rep_002',
        month: '2024-05',
        initial_contact_rate: 0.80,
        proposal_submission_rate: 0.70,
        followup_count: 9,
        contract_preparation_rate: 0.60
      },
      {
        sales_rep_id: 'rep_002',
        month: '2024-06',
        initial_contact_rate: 0.82,
        proposal_submission_rate: 0.72,
        followup_count: 10,
        contract_preparation_rate: 0.62
      }
    ];

    // 入力パラメータ
    const input = {
      sales_results: sales_results_data,
      process_steps: process_step_execution_data,
      analysis_period_start: '2024-01-01',
      analysis_period_end: '2024-06-30',
      target_sales_rep_ids: ['rep_001', 'rep_002']
    };

    // 成約相関分析機能を実行
    const result = analyzeCorrelationWithSalesResults(input);

    // 可視化データオブジェクトの存在確認
    expect(result).toBeDefined();
    expect(result.visualization_data).toBeDefined();

    // correlation_coefficient が 0.75 以上の数値であることを確認
    expect(result.visualization_data.correlation_coefficient).toBeGreaterThanOrEqual(0.75);
    expect(typeof result.visualization_data.correlation_coefficient).toBe('number');

    // correlation_direction が 'positive' であることを確認
    expect(result.visualization_data.correlation_direction).toBe('positive');

    // data_points配列が2件以上のデータポイントを保持していることを確認
    expect(Array.isArray(result.visualization_data.data_points)).toBe(true);
    expect(result.visualization_data.data_points.length).toBeGreaterThanOrEqual(2);

    // 各データポイントが process_step_execution_rate と contract_rate の両属性を持つことを確認
    result.visualization_data.data_points.forEach((data_point: any) => {
      expect(data_point).toHaveProperty('process_step_execution_rate');
      expect(data_point).toHaveProperty('contract_rate');
      expect(typeof data_point.process_step_execution_rate).toBe('number');
      expect(typeof data_point.contract_rate).toBe('number');
    });

    // 分析の根拠データセット情報が含まれていることを確認
    expect(result.dataset_metadata).toBeDefined();
    expect(result.dataset_metadata.analysis_period_start).toBe('2024-01-01');
    expect(result.dataset_metadata.analysis_period_end).toBe('2024-06-30');
    expect(result.dataset_metadata.target_sales_rep_count).toBe(2);
    expect(result.dataset_metadata.valid_record_count).toBe(12);

    // 計算ロジック情報が記録されていることを確認
    expect(result.calculation_logic).toBeDefined();
    expect(result.calculation_logic.correlation_method).toBe('pearson');
    expect(result.calculation_logic.sample_size).toBe(12);

    // 具体的な相関係数の値を検証（テストデータの構造から期待される値）
    expect(result.visualization_data.correlation_coefficient).toBeGreaterThanOrEqual(0.75);
    expect(result.visualization_data.correlation_coefficient).toBeLessThanOrEqual(1.0);
  });
});