import { classifyDetectedIssues } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-801: [edge] 問題検出結果の重要度・優先度分類機能 - 検出問題数がちょうど閾値（例：10件）の時、すべての問題が正しく分類される
  test('should classify exactly 10 detected issues correctly by severity and priority', () => {
    const detectedIssues = [
      {
        issue_id: 'HIGH_RISK_001',
        issue_type: 'proposal_deviation',
        risk_level: 'high',
        impact_score: 85,
        frequency_count: 3,
      },
      {
        issue_id: 'HIGH_RISK_002',
        issue_type: 'process_violation',
        risk_level: 'high',
        impact_score: 90,
        frequency_count: 2,
      },
      {
        issue_id: 'HIGH_RISK_003',
        issue_type: 'customer_constraint_violation',
        risk_level: 'high',
        impact_score: 88,
        frequency_count: 4,
      },
      {
        issue_id: 'MEDIUM_RISK_001',
        issue_type: 'low_proposal_adoption',
        risk_level: 'medium',
        impact_score: 65,
        frequency_count: 2,
      },
      {
        issue_id: 'MEDIUM_RISK_002',
        issue_type: 'delayed_follow_up',
        risk_level: 'medium',
        impact_score: 60,
        frequency_count: 1,
      },
      {
        issue_id: 'MEDIUM_RISK_003',
        issue_type: 'insufficient_contact_frequency',
        risk_level: 'medium',
        impact_score: 62,
        frequency_count: 3,
      },
      {
        issue_id: 'MEDIUM_RISK_004',
        issue_type: 'proposal_quality_issue',
        risk_level: 'medium',
        impact_score: 58,
        frequency_count: 1,
      },
      {
        issue_id: 'LOW_RISK_001',
        issue_type: 'minor_data_gap',
        risk_level: 'low',
        impact_score: 35,
        frequency_count: 1,
      },
      {
        issue_id: 'LOW_RISK_002',
        issue_type: 'incomplete_activity_log',
        risk_level: 'low',
        impact_score: 30,
        frequency_count: 1,
      },
      {
        issue_id: 'LOW_RISK_003',
        issue_type: 'documentation_format_issue',
        risk_level: 'low',
        impact_score: 25,
        frequency_count: 2,
      },
    ];

    const classificationRules = {
      high: { severity: 'high', priority: 1 },
      medium: { severity: 'medium', priority: 2 },
      low: { severity: 'low', priority: 3 },
    };

    const result = classifyDetectedIssues(detectedIssues, classificationRules);

    expect(result.total_issues_processed).toBe(10);
    expect(result.unclassified_count).toBe(0);
    expect(result.misclassified_count).toBe(0);

    const high_severity_issues = result.classified_issues.filter(
      (issue) => issue.severity === 'high'
    );
    const medium_severity_issues = result.classified_issues.filter(
      (issue) => issue.severity === 'medium'
    );
    const low_severity_issues = result.classified_issues.filter(
      (issue) => issue.severity === 'low'
    );

    expect(high_severity_issues.length).toBe(3);
    expect(medium_severity_issues.length).toBe(4);
    expect(low_severity_issues.length).toBe(3);

    const priority_1_issues = result.classified_issues.filter(
      (issue) => issue.priority === 1
    );
    const priority_2_issues = result.classified_issues.filter(
      (issue) => issue.priority === 2
    );
    const priority_3_issues = result.classified_issues.filter(
      (issue) => issue.priority === 3
    );

    expect(priority_1_issues.length).toBe(3);
    expect(priority_2_issues.length).toBe(4);
    expect(priority_3_issues.length).toBe(3);

    high_severity_issues.forEach((issue) => {
      expect(issue.severity).toBe('high');
      expect(issue.priority).toBe(1);
      expect(['HIGH_RISK_001', 'HIGH_RISK_002', 'HIGH_RISK_003']).toContain(
        issue.issue_id
      );
    });

    medium_severity_issues.forEach((issue) => {
      expect(issue.severity).toBe('medium');
      expect(issue.priority).toBe(2);
      expect([
        'MEDIUM_RISK_001',
        'MEDIUM_RISK_002',
        'MEDIUM_RISK_003',
        'MEDIUM_RISK_004',
      ]).toContain(issue.issue_id);
    });

    low_severity_issues.forEach((issue) => {
      expect(issue.severity).toBe('low');
      expect(issue.priority).toBe(3);
      expect(['LOW_RISK_001', 'LOW_RISK_002', 'LOW_RISK_003']).toContain(
        issue.issue_id
      );
    });

    expect(result.classified_issues.length).toBe(10);
    const classified_ids = result.classified_issues.map(
      (issue) => issue.issue_id
    );
    expect(new Set(classified_ids).size).toBe(10);
  });
});