import { evaluateDetectionResultNecessity } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-851
  test('問題検出結果の重要度・根拠・対応必要性判定機能 - 対応期間制約が対応可能期間上限未満のとき対応必要と判定される', () => {
    const detection_result = {
      severity: 'High',
      reason: '営業プロセス逸脱',
      response_period_constraint_days: 29,
    };

    const response_period_limit_days = 30;

    const result = evaluateDetectionResultNecessity(
      detection_result,
      response_period_limit_days
    );

    expect(result.is_response_required).toBe(true);
    expect(result.necessity_status).toBe('対応必要');
    expect(result.judgment_reason).toContain(
      '対応期間制約（29日）が対応可能期間上限（30日）未満のため対応が必要'
    );
  });
});