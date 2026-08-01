import { determineCounselingTarget } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-178: 乖離度が許容範囲の上限を超える場合、改善指導対象として判定される', () => {
    // 初期化: 許容範囲の上限値を80（パーセンテージ）に設定
    const toleranceUpperLimit = 80;
    
    // テストデータ準備: 乖離度を81に設定した営業担当者
    const salesPersonId = 'SP-001';
    const deviationDegree = 81;
    const currentStatus = '通常';
    
    // 改善指導対象判定ロジックを実行
    const result = determineCounselingTarget({
      salesPersonId,
      deviationDegree,
      toleranceUpperLimit,
      currentStatus
    });
    
    // 期待結果の検証
    expect(result.isCounselingTarget).toBe(true);
    expect(result.updatedStatus).toBe('改善指導対象');
  });
});