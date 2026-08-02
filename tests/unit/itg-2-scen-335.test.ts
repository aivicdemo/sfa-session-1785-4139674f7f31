import { calculatePriorityScoreWithZeroCorrelation } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  test('SCEN-335: 相関係数がゼロとなる場合、改善指導の優先順位が適切に計算される', () => {
    // 相関係数がゼロ（0.0）となるテストデータセットを準備
    // 2つの独立した営業指標データ
    const salesMetrics = {
      employeeId: 'EMP001',
      metric1: [100, 200, 300, 400, 500],
      metric2: [500, 400, 300, 200, 100],
      correlation: 0.0,
    };

    // 改善指導の優先順位計算ロジックを実行
    const result = calculatePriorityScoreWithZeroCorrelation({
      correlation: salesMetrics.correlation,
      metric1Values: salesMetrics.metric1,
      metric2Values: salesMetrics.metric2,
      employeeId: salesMetrics.employeeId,
    });

    // 優先順位スコアが「中程度（スコア範囲: 40～60）」の値であることを検証
    expect(result.priorityScore).toBe(45);

    // 優先順位の分類ラベルが「要改善」に分類されていることを確認
    expect(result.label).toBe('要改善');

    // 相関係数がゼロの状態が正しく反映されていることを確認
    expect(result.correlation).toBe(0.0);
  });
});