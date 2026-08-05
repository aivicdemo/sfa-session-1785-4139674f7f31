import { classifyDetectedProblems } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターン分析と問題検出分類', () => {
  test('SCEN-781: 問題検出結果の重要度・優先度分類機能 - 顧客対応パターンに関連する問題が適切に優先度で分類される', () => {
    // 準備: 問題検出結果のスタブデータ
    const detectedProblems = [
      {
        problem_id: 'P001',
        problem_type: 'customer_response_pattern',
        problem_category: '顧客との約束期日未達成',
        severity: 'medium',
        detected_at: '2024-01-15T10:30:00Z',
        affected_deal_id: 'DEAL-001',
        affected_sales_person_id: 'SP-001',
      },
      {
        problem_id: 'P002',
        problem_type: 'customer_response_pattern',
        problem_category: '顧客クレーム未対応',
        severity: 'high',
        detected_at: '2024-01-15T11:00:00Z',
        affected_deal_id: 'DEAL-002',
        affected_sales_person_id: 'SP-002',
      },
      {
        problem_id: 'P003',
        problem_type: 'customer_response_pattern',
        problem_category: '顧客満足度スコア低下',
        severity: 'low',
        detected_at: '2024-01-15T11:30:00Z',
        affected_deal_id: 'DEAL-003',
        affected_sales_person_id: 'SP-003',
      },
    ];

    // 実行: 優先度分類ロジックの入力として問題データを渡す
    const classificationResult = classifyDetectedProblems(detectedProblems);

    // 検証: 顧客対応パターンに関連する問題がすべて抽出されていることを確認
    expect(classificationResult.classified_problems.length).toBe(3);

    // 検証: 各問題が優先度レベルを保有していることを確認
    const customer_response_problems = classificationResult.classified_problems.filter(
      (p: { problem_type: string }) => p.problem_type === 'customer_response_pattern'
    );
    expect(customer_response_problems.length).toBe(3);

    // 検証: 優先度レベルの割り当てを確認
    const complaint_problem = customer_response_problems.find(
      (p: { problem_category: string }) => p.problem_category === '顧客クレーム未対応'
    );
    expect(complaint_problem.priority_level).toBe('high');

    const promise_date_problem = customer_response_problems.find(
      (p: { problem_category: string }) => p.problem_category === '顧客との約束期日未達成'
    );
    expect(promise_date_problem.priority_level).toBe('medium');

    const satisfaction_problem = customer_response_problems.find(
      (p: { problem_category: string }) => p.problem_category === '顧客満足度スコア低下'
    );
    expect(satisfaction_problem.priority_level).toBe('low');

    // 検証: 分類結果が優先度『高』→『中』→『低』の降順で並んでいることを確認
    const sorted_problems = classificationResult.sorted_by_priority;
    expect(sorted_problems.length).toBe(3);

    expect(sorted_problems[0].problem_id).toBe('P002');
    expect(sorted_problems[0].priority_level).toBe('high');
    expect(sorted_problems[0].problem_category).toBe('顧客クレーム未対応');

    expect(sorted_problems[1].problem_id).toBe('P001');
    expect(sorted_problems[1].priority_level).toBe('medium');
    expect(sorted_problems[1].problem_category).toBe('顧客との約束期日未達成');

    expect(sorted_problems[2].problem_id).toBe('P003');
    expect(sorted_problems[2].priority_level).toBe('low');
    expect(sorted_problems[2].problem_category).toBe('顧客満足度スコア低下');

    // 検証: 優先度が正しい順序で並んでいることを確認
    const priority_sequence = sorted_problems.map((p: { priority_level: string }) => p.priority_level);
    expect(priority_sequence).toEqual(['high', 'medium', 'low']);

    // 検証: 処理結果のメタデータ確認
    expect(classificationResult.total_problems_detected).toBe(3);
    expect(classificationResult.customer_response_problems_count).toBe(3);
    expect(classificationResult.classification_timestamp).toBeDefined();
  });
});