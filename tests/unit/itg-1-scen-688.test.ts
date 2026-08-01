import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-688
  test('改善優先度スコア算出機能 - 顧客対応パターンの問題について優先度スコアが計算される', () => {
    // 対応漏れ（最も深刻）のテストケース
    const missedResponseProblem = {
      problemType: 'missed_response',
      severity: 'high',
      affectedCustomerCount: 5,
      occurrenceFrequency: 3,
    };
    const missedResponseScore = calculateImprovementPriorityScore(missedResponseProblem);
    expect(missedResponseScore).toBe(85);
    expect(typeof missedResponseScore).toBe('number');
    expect(missedResponseScore).toBeGreaterThanOrEqual(0);
    expect(missedResponseScore).toBeLessThanOrEqual(100);

    // 対応遅延（中程度）のテストケース
    const delayedResponseProblem = {
      problemType: 'delayed_response',
      severity: 'medium',
      affectedCustomerCount: 3,
      occurrenceFrequency: 2,
    };
    const delayedResponseScore = calculateImprovementPriorityScore(delayedResponseProblem);
    expect(delayedResponseScore).toBe(55);
    expect(typeof delayedResponseScore).toBe('number');
    expect(delayedResponseScore).toBeGreaterThanOrEqual(0);
    expect(delayedResponseScore).toBeLessThanOrEqual(100);

    // 不適切な対応内容（低程度）のテストケース
    const inappropriateContentProblem = {
      problemType: 'inappropriate_content',
      severity: 'low',
      affectedCustomerCount: 2,
      occurrenceFrequency: 1,
    };
    const inappropriateContentScore = calculateImprovementPriorityScore(inappropriateContentProblem);
    expect(inappropriateContentScore).toBe(30);
    expect(typeof inappropriateContentScore).toBe('number');
    expect(inappropriateContentScore).toBeGreaterThanOrEqual(0);
    expect(inappropriateContentScore).toBeLessThanOrEqual(100);

    // スコアが深刻度に応じて段階的に異なることを検証
    expect(missedResponseScore).toBeGreaterThan(delayedResponseScore);
    expect(delayedResponseScore).toBeGreaterThan(inappropriateContentScore);
  });
});