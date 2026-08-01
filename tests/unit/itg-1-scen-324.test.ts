import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-324: [edge] 標準プロセスからの乖離度が100%の場合、正常に判定される', () => {
    // 標準プロセス定義
    const standardProcessSteps = [
      { step_id: 'step_1', step_name: '初回接触', sequence: 1 },
      { step_id: 'step_2', step_name: '提案', sequence: 2 },
      { step_id: 'step_3', step_name: '交渉', sequence: 3 },
      { step_id: 'step_4', step_name: '成約', sequence: 4 },
    ];

    // 営業担当者の実際の行動データ（標準プロセスの全ステップが実行されていない）
    const actualBehaviorData = [
      { activity_id: 'act_1', activity_type: '外部連携', timestamp: '2024-01-15T09:00:00Z' },
      { activity_id: 'act_2', activity_type: '独自処理', timestamp: '2024-01-15T10:30:00Z' },
    ];

    const salesPersonId = 'sales_001';
    const analysisMonth = '2024-01';

    // 行動パターン分析レポート生成関数を実行
    const report = generateBehaviorPatternAnalysisReport({
      sales_person_id: salesPersonId,
      standard_process_steps: standardProcessSteps,
      actual_behavior_data: actualBehaviorData,
      analysis_period: analysisMonth,
    });

    // 期待結果の検証
    expect(report).toBeDefined();
    expect(report.deviation_score).toBe(100);
    expect(report.judgment_status).toBe('乖離度100%：標準プロセス未遵守');
    expect(report.sales_person_id).toBe(salesPersonId);
    expect(report.analysis_period).toBe(analysisMonth);
  });
});