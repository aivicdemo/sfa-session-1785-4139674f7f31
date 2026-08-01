import { classifyAndSortIssuesByPriority } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-523
  test('複数の問題が検出された場合、優先度が高い順に並べ替えられる', () => {
    const detected_issues = [
      {
        issue_id: 'issue_001',
        detected_at: '2024-01-15T10:00:00Z',
        priority: 'high',
        severity: 'critical',
        description: 'データ品質スコア異常低下'
      },
      {
        issue_id: 'issue_002',
        detected_at: '2024-01-15T10:05:00Z',
        priority: 'low',
        severity: 'minor',
        description: '推論実行時間が閾値超過'
      },
      {
        issue_id: 'issue_003',
        detected_at: '2024-01-15T10:10:00Z',
        priority: 'medium',
        severity: 'warning',
        description: 'AIエージェント推論精度低下'
      },
      {
        issue_id: 'issue_004',
        detected_at: '2024-01-15T10:15:00Z',
        priority: 'high',
        severity: 'critical',
        description: 'システムヘルスチェック失敗'
      },
      {
        issue_id: 'issue_005',
        detected_at: '2024-01-15T10:20:00Z',
        priority: 'medium',
        severity: 'warning',
        description: 'データベース接続遅延'
      }
    ];

    const sorted_result = classifyAndSortIssuesByPriority(detected_issues);

    expect(sorted_result).toEqual([
      {
        issue_id: 'issue_001',
        detected_at: '2024-01-15T10:00:00Z',
        priority: 'high',
        severity: 'critical',
        description: 'データ品質スコア異常低下'
      },
      {
        issue_id: 'issue_004',
        detected_at: '2024-01-15T10:15:00Z',
        priority: 'high',
        severity: 'critical',
        description: 'システムヘルスチェック失敗'
      },
      {
        issue_id: 'issue_003',
        detected_at: '2024-01-15T10:10:00Z',
        priority: 'medium',
        severity: 'warning',
        description: 'AIエージェント推論精度低下'
      },
      {
        issue_id: 'issue_005',
        detected_at: '2024-01-15T10:20:00Z',
        priority: 'medium',
        severity: 'warning',
        description: 'データベース接続遅延'
      },
      {
        issue_id: 'issue_002',
        detected_at: '2024-01-15T10:05:00Z',
        priority: 'low',
        severity: 'minor',
        description: '推論実行時間が閾値超過'
      }
    ]);
  });
});