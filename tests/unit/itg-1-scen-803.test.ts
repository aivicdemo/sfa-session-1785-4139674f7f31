import { classifyDetectedProblems } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-803
  test('問題検出結果の重要度・優先度分類機能 - 検出問題数が閾値超過（11件）の時、すべての問題が分類される', () => {
    // 初期化: 11件の検出問題データを準備
    const detected_problems = [
      { problem_id: 'P001', severity: 'high', description: 'System down' },
      { problem_id: 'P002', severity: 'high', description: 'Data loss' },
      { problem_id: 'P003', severity: 'high', description: 'API timeout' },
      { problem_id: 'P004', severity: 'high', description: 'Memory leak' },
      { problem_id: 'P005', severity: 'high', description: 'Security breach' },
      { problem_id: 'P006', severity: 'medium', description: 'Slow query' },
      { problem_id: 'P007', severity: 'medium', description: 'Incomplete log' },
      { problem_id: 'P008', severity: 'medium', description: 'Config mismatch' },
      { problem_id: 'P009', severity: 'low', description: 'Minor UI bug' },
      { problem_id: 'P010', severity: 'low', description: 'Typo in message' },
      { problem_id: 'P011', severity: 'low', description: 'Unused import' },
    ];

    // 分類処理を実行
    const classification_result = classifyDetectedProblems(detected_problems);

    // 重要度別に分類された問題の件数を検証
    const high_severity_count = classification_result.classified_by_severity.filter(
      (item) => item.severity === 'high'
    ).length;
    const medium_severity_count = classification_result.classified_by_severity.filter(
      (item) => item.severity === 'medium'
    ).length;
    const low_severity_count = classification_result.classified_by_severity.filter(
      (item) => item.severity === 'low'
    ).length;

    expect(high_severity_count).toBe(5);
    expect(medium_severity_count).toBe(3);
    expect(low_severity_count).toBe(3);

    // 優先度別に分類された問題の件数を検証
    const priority_1_count = classification_result.classified_by_priority.filter(
      (item) => item.priority === 1
    ).length;
    const priority_2_count = classification_result.classified_by_priority.filter(
      (item) => item.priority === 2
    ).length;
    const priority_3_count = classification_result.classified_by_priority.filter(
      (item) => item.priority === 3
    ).length;

    // 優先度分類: 高重要度は優先度1, 中は優先度2, 低は優先度3
    expect(priority_1_count).toBe(5);
    expect(priority_2_count).toBe(3);
    expect(priority_3_count).toBe(3);

    // すべての問題が分類されていることを確認（未分類問題は0件）
    const total_classified_problems = classification_result.classified_by_severity.length;
    expect(total_classified_problems).toBe(11);

    // 各問題にproblem_idが割り当てられていることを確認
    const problem_ids_from_classification = classification_result.classified_by_severity.map(
      (item) => item.problem_id
    );
    const expected_problem_ids = [
      'P001',
      'P002',
      'P003',
      'P004',
      'P005',
      'P006',
      'P007',
      'P008',
      'P009',
      'P010',
      'P011',
    ];
    expect(problem_ids_from_classification.sort()).toEqual(expected_problem_ids.sort());

    // 未分類問題の有無を確認
    expect(classification_result.unclassified_problem_count).toBe(0);
  });
});