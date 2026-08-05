import { calculateIssueClassification } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-808
  test('対応期限の開始日と終了日が同日の場合、優先度が最高に設定される', () => {
    // Arrange
    const issueData = {
      issue_id: 'issue_001',
      severity: 'high',
      response_start_date: new Date('2024-01-15T00:00:00Z'),
      response_end_date: new Date('2024-01-15T23:59:59Z'),
      affected_systems: ['sales_process_audit', 'data_quality_management'],
      occurrence_count: 3,
    };

    // Act
    const result = calculateIssueClassification(issueData);

    // Assert
    expect(result.priority).toBe('P0');
    expect(result.priority_label).toBe('最高');
  });
});