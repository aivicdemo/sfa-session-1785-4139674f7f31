import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-794: [error] 問題検出結果の分類・優先度付け機能 - 優先度の値が定義済み分類値以外の場合、エラーになる
  test('SCEN-794: 優先度が無効な値の場合はエラーをthrowする', async () => {
    const { classifyAndPrioritizeDetectionResult } = await import(
      '../../src/logic/it-1-br-2-1-1-1'
    );

    const invalid_priority_issue = {
      issue_id: 'ISS-001',
      detected_at: '2024-01-15T11:30:00Z',
      priority: 'URGENT',
      severity: 'high',
      detected_by_ai_agent_id: 'AG-001',
      is_resolved: false,
    };

    expect(() => classifyAndPrioritizeDetectionResult(invalid_priority_issue)).toThrow(
      /優先度/
    );
  });
});