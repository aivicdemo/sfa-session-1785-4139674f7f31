import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合・推奨機能', () => {
  // SCEN-1894
  test('新規案件の商談条件と過去事例の商談条件が互換性を持たないとき推奨生成に失敗する', () => {
    const newDealCondition = {
      company_size: 'large_enterprise',
      industry: 'manufacturing',
      budget_amount: 50000000,
      budget_currency: 'JPY',
      decision_maker_role: 'CEO',
      implementation_timeline_months: 3,
    };

    const incompatibleHistoricalPattern = {
      id: 'pattern_001',
      company_size: 'startup',
      industry: 'fintech',
      budget_amount: 5000000,
      budget_currency: 'JPY',
      decision_maker_role: 'CTO',
      implementation_timeline_months: 12,
    };

    const fallbackPatterns = [
      {
        id: 'fallback_rank_1',
        pattern_name: 'Enterprise Manufacturing Quick Deploy',
        success_rate: 0.92,
        supporting_reason_brief: 'Large manufacturers with 3-month timeline showed 92% success',
      },
      {
        id: 'fallback_rank_2',
        pattern_name: 'CEO Decision Path Acceleration',
        success_rate: 0.88,
        supporting_reason_brief: 'CEO-level decisions accelerated by 2x in similar budgets',
      },
      {
        id: 'fallback_rank_3',
        pattern_name: 'High-Budget Aggressive Timeline',
        success_rate: 0.85,
        supporting_reason_brief: 'Budget over 50M with 3-month constraint achieved 85% adoption',
      },
    ];

    const mockAIEngine = {
      evaluatePatternRelevance: (newCondition, historicalPattern) => {
        if (
          newCondition.company_size !== historicalPattern.company_size ||
          newCondition.industry !== historicalPattern.industry ||
          Math.abs(newCondition.budget_amount - historicalPattern.budget_amount) > 20000000 ||
          newCondition.decision_maker_role !== historicalPattern.decision_maker_role ||
          Math.abs(newCondition.implementation_timeline_months - historicalPattern.implementation_timeline_months) > 6
        ) {
          return { compatibility_score: 0.15 };
        }
        return { compatibility_score: 0.8 };
      },
      generateRecommendation: (newCondition, historicalPatterns) => {
        const scores = historicalPatterns.map((pattern) =>
          mockAIEngine.evaluatePatternRelevance(newCondition, pattern)
        );
        const hasIncompatibleScore = scores.some((s) => s.compatibility_score <= 0.5);

        if (hasIncompatibleScore) {
          return {
            error_code: 'PATTERN_INCOMPATIBILITY_ERROR',
            error_message:
              '商談条件が過去の成功パターンと互換性を持たないため、推奨生成に失敗しました。異なる案件条件の事例から類似パターンを検索してください。',
            fallback_patterns: fallbackPatterns,
            user_message: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
            is_fallback_mode: true,
          };
        }

        return {
          error_code: null,
          recommendation: [],
          is_fallback_mode: false,
        };
      },
    };

    const result = generateRecommendation(
      newDealCondition,
      [incompatibleHistoricalPattern],
      mockAIEngine
    );

    expect(result.error_code).toBe('PATTERN_INCOMPATIBILITY_ERROR');
    expect(result.error_message).toBe(
      '商談条件が過去の成功パターンと互換性を持たないため、推奨生成に失敗しました。異なる案件条件の事例から類似パターンを検索してください。'
    );
    expect(result.fallback_patterns).toHaveLength(3);
    expect(result.fallback_patterns[0].id).toBe('fallback_rank_1');
    expect(result.fallback_patterns[0].success_rate).toBe(0.92);
    expect(result.fallback_patterns[1].id).toBe('fallback_rank_2');
    expect(result.fallback_patterns[1].success_rate).toBe(0.88);
    expect(result.fallback_patterns[2].id).toBe('fallback_rank_3');
    expect(result.fallback_patterns[2].success_rate).toBe(0.85);
    expect(result.user_message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );
    expect(result.is_fallback_mode).toBe(true);
  });
});