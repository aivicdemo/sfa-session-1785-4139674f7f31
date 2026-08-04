import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-2224
  test('新規案件の顧客条件が過去成功パターンと照合され、関連性スコアで降順ソートされて表示される', async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          pattern_id: 'PATTERN_A',
          industry: 'IT・ソフトウェア',
          employee_range_min: 500,
          employee_range_max: 1000,
          issue_category: '業務効率化',
          contract_rate: 92,
          relevance_score: 95,
        },
        {
          pattern_id: 'PATTERN_B',
          industry: 'IT・ソフトウェア',
          employee_range_min: 1000,
          employee_range_max: 2000,
          issue_category: 'コスト削減',
          contract_rate: 88,
          relevance_score: 78,
        },
        {
          pattern_id: 'PATTERN_C',
          industry: '金融',
          employee_range_min: 100,
          employee_range_max: 500,
          issue_category: 'セキュリティ',
          contract_rate: 85,
          relevance_score: 62,
        },
      ]),
    };

    const newCaseCondition = {
      industry: 'IT・ソフトウェア',
      employee_range_min: 500,
      employee_range_max: 1000,
      issue_category: '業務効率化',
      budget_min: 5000000,
      budget_max: 10000000,
      decision_maker: 'CTO',
    };

    const result = await findSimilarPatterns(
      newCaseCondition,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newCaseCondition
    );

    expect(result.message).toBe('関連性が高い過去成功事例が見つかりました');

    expect(result.matched_patterns).toHaveLength(3);

    expect(result.matched_patterns[0]).toEqual({
      pattern_id: 'PATTERN_A',
      industry: 'IT・ソフトウェア',
      employee_range_min: 500,
      employee_range_max: 1000,
      issue_category: '業務効率化',
      contract_rate: 92,
      relevance_score: 95,
    });

    expect(result.matched_patterns[1]).toEqual({
      pattern_id: 'PATTERN_B',
      industry: 'IT・ソフトウェア',
      employee_range_min: 1000,
      employee_range_max: 2000,
      issue_category: 'コスト削減',
      contract_rate: 88,
      relevance_score: 78,
    });

    expect(result.matched_patterns[2]).toEqual({
      pattern_id: 'PATTERN_C',
      industry: '金融',
      employee_range_min: 100,
      employee_range_max: 500,
      issue_category: 'セキュリティ',
      contract_rate: 85,
      relevance_score: 62,
    });

    expect(result.matched_patterns[0].relevance_score).toBeGreaterThanOrEqual(
      result.matched_patterns[1].relevance_score
    );
    expect(result.matched_patterns[1].relevance_score).toBeGreaterThanOrEqual(
      result.matched_patterns[2].relevance_score
    );

    expect(result.matched_patterns[0].contract_rate).toBe(92);
    expect(result.matched_patterns[1].contract_rate).toBe(88);
    expect(result.matched_patterns[2].contract_rate).toBe(85);
  });
});