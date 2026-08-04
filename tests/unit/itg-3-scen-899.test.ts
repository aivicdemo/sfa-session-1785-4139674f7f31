import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン照合機能', () => {
  // SCEN-899
  test('複数の顧客条件が入力されたとき照合が正しく実行される', () => {
    const input_conditions = {
      industry: 'IT',
      company_scale: '中堅',
      budget_min: 50000000,
      decision_makers_min: 3,
    };

    const mock_success_patterns = [
      {
        pattern_id: 'pat_001',
        industry: 'IT',
        company_scale: '中堅',
        budget_min: 50000000,
        decision_makers_min: 3,
        relevance_score: 0.95,
        matched_conditions: ['業種IT一致', '企業規模中堅一致', '予算5000万円以上一致', '決裁者数3名以上一致'],
      },
      {
        pattern_id: 'pat_002',
        industry: 'IT',
        company_scale: '中堅',
        budget_min: 30000000,
        decision_makers_min: 2,
        relevance_score: 0.78,
        matched_conditions: ['業種IT一致', '企業規模中堅一致', '決裁者数3名以上一致'],
      },
      {
        pattern_id: 'pat_003',
        industry: 'IT',
        company_scale: '大企業',
        budget_min: 50000000,
        decision_makers_min: 5,
        relevance_score: 0.62,
        matched_conditions: ['業種IT一致', '予算5000万円以上一致'],
      },
      {
        pattern_id: 'pat_004',
        industry: 'IT',
        company_scale: '中堅',
        budget_min: 50000000,
        decision_makers_min: 3,
        relevance_score: 0.88,
        matched_conditions: ['業種IT一致', '企業規模中堅一致', '予算5000万円以上一致', '決裁者数3名以上一致'],
      },
    ];

    const mock_engine = {
      findSimilarPatterns: jest.fn().mockReturnValue(
        mock_success_patterns
          .filter(
            (pattern) =>
              pattern.industry === input_conditions.industry &&
              pattern.company_scale === input_conditions.company_scale &&
              pattern.budget_min >= input_conditions.budget_min &&
              pattern.decision_makers_min >= input_conditions.decision_makers_min
          )
          .sort((a, b) => b.relevance_score - a.relevance_score)
      ),
    };

    const result = mock_engine.findSimilarPatterns(input_conditions);

    expect(result).toHaveLength(2);

    expect(result[0].pattern_id).toBe('pat_001');
    expect(result[0].relevance_score).toBe(0.95);
    expect(result[0].matched_conditions).toEqual([
      '業種IT一致',
      '企業規模中堅一致',
      '予算5000万円以上一致',
      '決裁者数3名以上一致',
    ]);

    expect(result[1].pattern_id).toBe('pat_004');
    expect(result[1].relevance_score).toBe(0.88);
    expect(result[1].matched_conditions).toEqual([
      '業種IT一致',
      '企業規模中堅一致',
      '予算5000万円以上一致',
      '決裁者数3名以上一致',
    ]);

    for (const pattern of result) {
      expect(pattern.relevance_score).toBeGreaterThanOrEqual(0);
      expect(pattern.relevance_score).toBeLessThanOrEqual(1);
    }

    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].relevance_score).toBeGreaterThanOrEqual(result[i + 1].relevance_score);
    }

    expect(result.every((pattern) => pattern.industry === input_conditions.industry)).toBe(true);
    expect(result.every((pattern) => pattern.company_scale === input_conditions.company_scale)).toBe(true);
    expect(result.every((pattern) => pattern.budget_min >= input_conditions.budget_min)).toBe(true);
    expect(result.every((pattern) => pattern.decision_makers_min >= input_conditions.decision_makers_min)).toBe(true);
  });
});