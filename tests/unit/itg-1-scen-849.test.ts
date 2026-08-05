import { describe, test, expect } from '@jest/globals';
import { judgeActionNecessity } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-849: 対応期間制約がちょうど対応可能期間上限のとき対応必要と判定される', () => {
    const input = {
      problem_severity: 'high',
      detection_confidence: 0.92,
      action_required_days: 30,
      action_possible_days_limit: 30,
      business_impact_score: 8.5,
      is_recurring: true,
      affected_record_count: 15,
    };

    const result = judgeActionNecessity(input);

    expect(result.is_action_necessary).toBe(true);
    expect(result.action_necessity_score).toBe(1.0);
    expect(result.judgment_reason).toContain('対応期間制約30日が対応可能期間上限30日に到達したため対応が必須');
    expect(result.recommended_action_timing).toBe('immediate');
    expect(result.priority_level).toBe(1);
    expect(result.judgment_timestamp).toBeDefined();
  });
});