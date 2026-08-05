import { describe, test, expect } from '@jest/globals';
import { validateFollowUpSuccessRate } from '../../src/logic/it-1-br-2-1-1';

describe('チーム営業品質統計分析機能 - フォローアップ成功率検証', () => {
  test('SCEN-887: フォローアップ成功率が100%を超えるとき、エラーになる', () => {
    const invalid_success_rate = 101;

    const result = validateFollowUpSuccessRate({
      followup_success_rate: invalid_success_rate,
    });

    expect(result).toHaveProperty('error_code', 'INVALID_SUCCESS_RATE');
    expect(result).toHaveProperty(
      'error_message',
      'フォローアップ成功率は0%から100%の範囲で設定してください。入力値: 101%'
    );
    expect(result.is_valid).toBe(false);
  });
});