import { calculateRecommendationTrustScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-881
  test('推奨信頼度スコア算出機能 - 同一入力で2回実行しても同じ信頼度スコアが返される', () => {
    const mock_ai_engine = {
      generateRecommendation: jest.fn((conditions) => ({
        patternId: 'PAT-20240115-001',
        description: '製造業向け業務効率化提案パターン',
        confidenceScore: 0.8542,
        reasoningScores: {
          historicalMatch: 0.85,
          customerFitness: 0.88,
          timingAlignment: 0.81,
          riskMitigation: 0.83,
        },
      })),
      findSimilarPatterns: jest.fn((conditions) => [
        {
          patternId: 'PAT-20240115-001',
          similarity: 0.92,
          pastDealCount: 15,
        },
      ]),
      evaluatePatternRelevance: jest.fn((pattern, conditions) => 0.8542),
    };

    const deal_conditions_first_run = {
      customer_industry: '製造業',
      project_scale_yen: 5000000,
      challenge_category: '業務効率化',
      customer_employee_count: 500,
      project_timeline_months: 6,
    };

    const deal_conditions_second_run = {
      customer_industry: '製造業',
      project_scale_yen: 5000000,
      challenge_category: '業務効率化',
      customer_employee_count: 500,
      project_timeline_months: 6,
    };

    const first_run_result = calculateRecommendationTrustScore(
      deal_conditions_first_run,
      mock_ai_engine
    );

    const second_run_result = calculateRecommendationTrustScore(
      deal_conditions_second_run,
      mock_ai_engine
    );

    expect(first_run_result.trust_score).toBe(second_run_result.trust_score);
    expect(first_run_result.trust_score).toBe(0.8542);

    expect(first_run_result.recommendation.pattern_id).toBe(
      second_run_result.recommendation.pattern_id
    );
    expect(first_run_result.recommendation.pattern_id).toBe('PAT-20240115-001');

    expect(first_run_result.recommendation.description).toBe(
      second_run_result.recommendation.description
    );
    expect(first_run_result.recommendation.description).toBe(
      '製造業向け業務効率化提案パターン'
    );

    expect(first_run_result.recommendation.reasoning_scores).toEqual(
      second_run_result.recommendation.reasoning_scores
    );
    expect(first_run_result.recommendation.reasoning_scores).toEqual({
      historicalMatch: 0.85,
      customerFitness: 0.88,
      timingAlignment: 0.81,
      riskMitigation: 0.83,
    });

    expect(typeof first_run_result.timestamp).toBe('string');
    expect(typeof second_run_result.timestamp).toBe('string');
  });
});