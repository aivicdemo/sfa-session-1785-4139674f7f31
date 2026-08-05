import { describe, test, expect } from '@jest/globals';
import { classifyAndPrioritizeDetectedIssues } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-787
  test('問題オブジェクトの優先度がnullの場合、エラーになる', () => {
    const detected_issue = {
      id: 'issue-001',
      timestamp: '2024-01-15T10:00:00Z',
      severity: 'high',
      priority: null as any,
      description: 'Data quality score below threshold',
      affected_system: 'sales_analytics',
      impact_scope: 'critical',
    };

    expect(() => classifyAndPrioritizeDetectedIssues(detected_issue)).toThrow(/優先度|Priority/);
  });
});