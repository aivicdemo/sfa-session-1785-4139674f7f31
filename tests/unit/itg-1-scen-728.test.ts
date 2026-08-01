import { evaluateComplianceCompletion } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-728: [error] 成功パターン適用ガイドラインの周知完了判定機能 - 理解度スコアが空文字列のとき処理がスキップされる
  test('理解度スコアが空文字列のとき、周知完了判定処理全体がスキップされる', () => {
    // 初期状態：周知完了判定機能の初期化
    const initialState = {
      guideline_id: 'guideline_001',
      assigned_staff_count: 100,
      understanding_score: '', // 理解度スコアを空文字列に設定
      test_completion_flag: false,
      application_report_count: 0,
      notification_status: 'pending',
      evaluation_status: 'not_started',
      compliance_completion_flag: false,
      training_material_delivery_status: 'not_delivered'
    };

    // テスト対象関数を実行
    const result = evaluateComplianceCompletion(initialState);

    // 期待結果：理解度スコアが空文字列の場合、すべての処理がスキップされる
    // スコア検証ロジックが実行されず、システム状態は変更されない
    expect(result.evaluation_status).toBe('not_started');
    expect(result.compliance_completion_flag).toBe(false);
    expect(result.training_material_delivery_status).toBe('not_delivered');
    expect(result.notification_status).toBe('pending');
    
    // スコア検証ロジックがスキップされたことを確認
    // （関数が早期リターンしたため、スコア評価関数が呼び出されていない）
    expect(result.understanding_score).toBe('');
  });
});