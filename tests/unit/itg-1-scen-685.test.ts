import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-685
  test('[normal] 改善優先度スコア算出機能 - 複数の営業担当者の問題パターンが混在するとき各営業担当者ごとの優先度が正確に計算される', () => {
    const problemRecords = [
      {
        sales_rep_id: 'A',
        problem_pattern: '提案資料未作成',
        importance: 'high',
        occurrence_frequency: 3,
      },
      {
        sales_rep_id: 'A',
        problem_pattern: '提案資料未作成',
        importance: 'high',
        occurrence_frequency: 3,
      },
      {
        sales_rep_id: 'A',
        problem_pattern: '提案資料未作成',
        importance: 'high',
        occurrence_frequency: 3,
      },
      {
        sales_rep_id: 'B',
        problem_pattern: '初回訪問遅延',
        importance: 'medium',
        occurrence_frequency: 5,
      },
      {
        sales_rep_id: 'B',
        problem_pattern: '初回訪問遅延',
        importance: 'medium',
        occurrence_frequency: 5,
      },
      {
        sales_rep_id: 'B',
        problem_pattern: '初回訪問遅延',
        importance: 'medium',
        occurrence_frequency: 5,
      },
      {
        sales_rep_id: 'B',
        problem_pattern: '初回訪問遅延',
        importance: 'medium',
        occurrence_frequency: 5,
      },
      {
        sales_rep_id: 'B',
        problem_pattern: '初回訪問遅延',
        importance: 'medium',
        occurrence_frequency: 5,
      },
      {
        sales_rep_id: 'C',
        problem_pattern: '提案資料未作成',
        importance: 'high',
        occurrence_frequency: 1,
      },
      {
        sales_rep_id: 'C',
        problem_pattern: '顧客フォローアップ漏れ',
        importance: 'medium',
        occurrence_frequency: 2,
      },
      {
        sales_rep_id: 'C',
        problem_pattern: '顧客フォローアップ漏れ',
        importance: 'medium',
        occurrence_frequency: 2,
      },
    ];

    const result = calculateImprovementPriorityScore(problemRecords);

    expect(result.length).toBe(3);

    const rep_a_score = result.find((r) => r.sales_rep_id === 'A');
    expect(rep_a_score).toBeDefined();
    expect(rep_a_score?.priority_score).toBe(45);

    const rep_b_score = result.find((r) => r.sales_rep_id === 'B');
    expect(rep_b_score).toBeDefined();
    expect(rep_b_score?.priority_score).toBe(25);

    const rep_c_score = result.find((r) => r.sales_rep_id === 'C');
    expect(rep_c_score).toBeDefined();
    expect(rep_c_score?.priority_score).toBe(20);
  });
});