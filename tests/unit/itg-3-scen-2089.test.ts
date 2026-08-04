import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2089
  test('提案内容と顧客対応パターンの標準プロセス照合分析 - 同じ提案内容と顧客対応パターンで2回実行しても同じスコアが返される', () => {
    const customer_info = {
      industry: 'IT',
      budget_jpy: 5000000,
      challenge: '業務効率化',
    };

    const response_pattern = {
      proposal_content: 'クラウド導入',
      followup_timing_days: 3,
    };

    const ai_recommendation_engine_stub = {
      evaluatePatternRelevance: (customer_info: unknown, response_pattern: unknown): number => {
        return 87.5;
      },
    };

    const first_call_score = evaluatePatternRelevance(
      customer_info,
      response_pattern,
      ai_recommendation_engine_stub
    );

    const second_call_score = evaluatePatternRelevance(
      customer_info,
      response_pattern,
      ai_recommendation_engine_stub
    );

    expect(first_call_score).toBe(87.5);
    expect(second_call_score).toBe(87.5);
    expect(first_call_score).toEqual(second_call_score);
  });
});