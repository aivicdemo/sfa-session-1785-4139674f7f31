import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 過去商談データから成功パターンを抽出し新規案件に推奨を返却', () => {
  // SCEN-923
  test('OpenAI API呼び出し失敗時に推奨パターンマスタから統計的に上位パターンを代替返却する', () => {
    const mockRecommendationPatternMaster = [
      {
        pattern_id: 'PATTERN_A',
        success_rate: 0.85,
        past_success_count: 120,
        applicable_industries: ['製造業'],
        pattern_description: 'Direct engagement with C-level executives',
      },
      {
        pattern_id: 'PATTERN_B',
        success_rate: 0.78,
        past_success_count: 95,
        applicable_industries: ['製造業'],
        pattern_description: 'Multi-stakeholder alignment approach',
      },
      {
        pattern_id: 'PATTERN_C',
        success_rate: 0.72,
        past_success_count: 80,
        applicable_industries: ['製造業'],
        pattern_description: 'Phased implementation strategy',
      },
    ];

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(new Error('API timeout')),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newProposal = {
      customer_industry: '製造業',
      transaction_amount: 5000000,
      decision_makers_count: 3,
      proposal_period_days: 14,
    };

    const result = generateRecommendation(
      newProposal,
      [],
      mockRecommendationPatternMaster,
      mockAIEngine
    );

    expect(result.recommended_pattern_id).toBe('PATTERN_A');
    expect(result.success_rate_score).toBe(0.85);
    expect(result.reasoning_text).toContain('過去の統計データから推奨しています');
    expect(result.fallback_mode).toBe(true);
  });
});