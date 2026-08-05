import { calculateStandardProcessComplianceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-257: 標準プロセス遵守度スコア計算機能 - 最大規模の営業件数でスコア計算時に精度が保証される', () => {
    // テスト用データセットの構築: 3,500件の営業案件レコード
    // 各レコードには標準プロセスの5つのチェックポイント遵守状況を含む
    const salesCases: Array<{
      caseId: string;
      checkpointCompliance: Array<{ checkpointId: string; isComplied: boolean }>;
    }> = [];

    // テストシナリオ: 3,500件の案件を生成
    // 遵守パターンを統計的に分散させる
    for (let i = 0; i < 3500; i++) {
      const checkpoints = [
        { checkpointId: 'initial_contact', isComplied: i % 5 !== 0 },
        { checkpointId: 'needs_analysis', isComplied: i % 7 !== 0 },
        { checkpointId: 'proposal', isComplied: i % 3 !== 0 },
        { checkpointId: 'negotiation', isComplied: i % 11 !== 0 },
        { checkpointId: 'contract_closure', isComplied: i % 13 !== 0 },
      ];
      salesCases.push({
        caseId: `case_${String(i).padStart(5, '0')}`,
        checkpointCompliance: checkpoints,
      });
    }

    // 期待値の手計算
    let totalCheckpointsComplied = 0;
    let totalCheckpoints = 0;
    for (const salesCase of salesCases) {
      for (const checkpoint of salesCase.checkpointCompliance) {
        totalCheckpoints += 1;
        if (checkpoint.isComplied) {
          totalCheckpointsComplied += 1;
        }
      }
    }

    // 期待スコアの算出: (遵守チェックポイント数 / 全チェックポイント数) * 100
    const expectedScore = (totalCheckpointsComplied / totalCheckpoints) * 100;

    // スコア計算機能の実行
    const startTime = Date.now();
    const result = calculateStandardProcessComplianceScore(salesCases);
    const endTime = Date.now();
    const executionTimeMs = endTime - startTime;

    // 計算精度が±0.01以内であることを検証
    expect(result.complianceScore).toBeGreaterThanOrEqual(expectedScore - 0.01);
    expect(result.complianceScore).toBeLessThanOrEqual(expectedScore + 0.01);

    // 処理実行時間が60秒以内であることを検証
    expect(executionTimeMs).toBeLessThan(60000);

    // 返却結果が0～100の範囲内であることを検証
    expect(result.complianceScore).toBeGreaterThanOrEqual(0);
    expect(result.complianceScore).toBeLessThanOrEqual(100);

    // 処理結果にメタデータが含まれることを検証
    expect(result.processedCaseCount).toBe(3500);
    expect(result.totalCheckpointsEvaluated).toBe(17500); // 3500 cases * 5 checkpoints
    expect(result.checkpointsCompliedCount).toBe(totalCheckpointsComplied);
  });
});