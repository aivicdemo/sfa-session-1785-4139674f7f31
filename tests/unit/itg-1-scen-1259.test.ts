import { runTx3Imp1Agent } from '../../src/logic/it-1';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  test('SCEN-1259: ヘルスチェック・データ品質・推論精度の統合診断と異常集約の自律実行 AIエージェント - 営業データ品質分析を実行し問題箇所を特定する', async () => {
    // テスト前提条件: 入力データセットを用意
    const input_data_set = {
      total_sales_records: 100,
      field_completeness_rate: 0.85,
      duplicate_record_count: 5,
      analysis_start_time: '2024-01-15T10:00:00Z'
    };

    // テスト前提条件: 期待される出力スキーマを定義
    const expected_output_schema = {
      problems: [
        {
          problem_type: 'incomplete_fields',
          affected_records_count: 15,
          severity_level: 'medium',
          root_cause: 'missing_sales_stage'
        },
        {
          problem_type: 'duplicate_records',
          affected_records_count: 5,
          severity_level: 'low',
          root_cause: 'duplicate_customer_id'
        }
      ],
      analysis_timestamp: '2024-01-15T10:30:00Z',
      data_quality_score: 0.85
    };

    // テスト前提条件: スタブAPIを注入
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        problems: [
          {
            problem_type: 'incomplete_fields',
            affected_records_count: 15,
            severity_level: 'medium',
            root_cause: 'missing_sales_stage'
          },
          {
            problem_type: 'duplicate_records',
            affected_records_count: 5,
            severity_level: 'low',
            root_cause: 'duplicate_customer_id'
          }
        ],
        analysis_timestamp: '2024-01-15T10:30:00Z',
        data_quality_score: 0.85
      })
    });

    // tx_3_imp_1_agent を起動
    const result = await runTx3Imp1Agent({
      trigger_type: 'scheduled_health_check',
      data_set: input_data_set,
      timestamp: '2024-01-15T10:00:00Z'
    });

    // AIエージェントが『営業データ品質分析を実行し問題箇所を特定する』の自律アクションを実行したかアサート
    expect(result).toBeDefined();
    expect(result.autonomous_actions).toContain('execute_data_quality_analysis');

    // スタブAPIが『営業レコード品質分析エンドポイント』に対して1回だけ呼び出されたことを検証
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/sales-record-quality-analysis'),
      expect.objectContaining({
        method: 'POST'
      })
    );

    // 返却されたレスポンスに以下の構造を確認: problems配列に2件のオブジェクト
    expect(result.analysis_result.problems).toHaveLength(2);

    // 返却されたレスポンスの第1問題について確認
    const first_problem = result.analysis_result.problems[0];
    expect(first_problem.problem_type).toBe('incomplete_fields');
    expect(first_problem.affected_records_count).toBe(15);
    expect(first_problem.severity_level).toBe('medium');
    expect(first_problem.root_cause).toBe('missing_sales_stage');

    // 返却されたレスポンスの第2問題について確認
    const second_problem = result.analysis_result.problems[1];
    expect(second_problem.problem_type).toBe('duplicate_records');
    expect(second_problem.affected_records_count).toBe(5);
    expect(second_problem.severity_level).toBe('low');
    expect(second_problem.root_cause).toBe('duplicate_customer_id');

    // 返却されたレスポンスの data_quality_score が 0.85 であることを確認
    expect(result.analysis_result.data_quality_score).toBe(0.85);

    // 返却されたレスポンスの analysis_timestamp が ISO 8601 形式であることを確認
    expect(result.analysis_result.analysis_timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    expect(result.analysis_result.analysis_timestamp).toBe('2024-01-15T10:30:00Z');

    // AIエージェントの実行ログに特定メッセージが記録されていることを確認
    expect(result.execution_logs).toContain(expect.stringMatching(/営業データ品質分析の実行開始/));
    expect(result.execution_logs).toContain(expect.stringMatching(/問題箇所の特定完了/));
    expect(result.execution_logs).toContain(expect.stringMatching(/affected_records_count計20件を集約/));

    // AIエージェントが他の自律アクションを実行していないことを確認
    expect(result.autonomous_actions).not.toContain('execute_system_health_check');
    expect(result.autonomous_actions).not.toContain('execute_inference_accuracy_evaluation');
    expect(result.autonomous_actions).toHaveLength(1);
  });
});