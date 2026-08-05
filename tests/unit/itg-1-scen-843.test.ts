import { describe, test, expect } from '@jest/globals';
import { judgeReportingNecessity } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-843: 問題検出結果の重要度・根拠・対応必要性判定機能 - 重要度スコアがちょうど報告閾値（例：70点）のとき報告対象に判定される
  test('should judge as reporting target when importance_score equals reporting_threshold', () => {
    const input = {
      importance_score: 70,
      reporting_threshold: 70,
      detection_basis: 'process_deviation_detected',
      response_required: true,
    };

    const result = judgeReportingNecessity(input);

    expect(result.is_reporting_target).toBe(true);
    expect(result.reporting_category).toBe('報告対象');
  });
});