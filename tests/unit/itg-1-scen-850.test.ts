import { calculateDeviationDegree, judgeDeviationLevel } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-850
  test('乖離度がちょうど100%の場合、標準プロセス完全乖離と判定し、レポートステータスがCOMPLETE_DEVIATIONになること', () => {
    // 標準プロセスのチェックポイント10個を定義
    const standard_checkpoints = [
      { id: 'CP001', name: '初回接触' },
      { id: 'CP002', name: '初回提案' },
      { id: 'CP003', name: '提案フォローアップ' },
      { id: 'CP004', name: '詳細提案' },
      { id: 'CP005', name: '交渉開始' },
      { id: 'CP006', name: '交渉継続1' },
      { id: 'CP007', name: '交渉継続2' },
      { id: 'CP008', name: '最終交渉' },
      { id: 'CP009', name: '成約条件確認' },
      { id: 'CP010', name: '成約締結' },
    ];

    // 営業プロセス実績データ：10個すべてのチェックポイントが未達成
    const actual_achievement = {
      achieved_checkpoints: [],
      total_checkpoints: 10,
      achieved_count: 0,
    };

    // 乖離度計算：達成チェックポイント数0個 / 標準プロセスチェックポイント数10個 = 0 / 10
    const deviation_degree = calculateDeviationDegree(
      actual_achievement.achieved_count,
      standard_checkpoints.length
    );

    // 乖離度がちょうど100%であることを確認
    expect(deviation_degree).toBe(100);

    // 乖離度に対応する判定結果を取得
    const judgment_result = judgeDeviationLevel(deviation_degree);

    // 判定結果が『標準プロセス完全乖離』であることを確認
    expect(judgment_result.judgment_label).toBe('標準プロセス完全乖離');

    // 分析レポートのステータスフラグが『COMPLETE_DEVIATION』であることを確認
    expect(judgment_result.report_status).toBe('COMPLETE_DEVIATION');

    // 実行履歴がログに記録されていることを確認
    expect(judgment_result.execution_log).toBeDefined();
    expect(judgment_result.execution_log).toHaveProperty('calculated_deviation_degree');
    expect(judgment_result.execution_log.calculated_deviation_degree).toBe(100);
    expect(judgment_result.execution_log).toHaveProperty('judgment_timestamp');
    expect(typeof judgment_result.execution_log.judgment_timestamp).toBe('string');
  });
});