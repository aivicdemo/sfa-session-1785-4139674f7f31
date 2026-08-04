import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-2248
  test('推奨履歴記録機能 - 同じ入力条件で2回実行しても同一の推奨履歴が記録される', async () => {
    const customer_name = 'テスト顧客A';
    const industry = 'IT';
    const budget = '500万円';
    const challenge = 'システム統合';

    const recommendation_id = 'REC-2024-001';
    const proposal_approach = 'クラウド統合戦略';
    const confidence_score = 0.92;

    const mock_ai_engine = {
      generateRecommendation: async () => ({
        recommendation_id: recommendation_id,
        proposal_approach: proposal_approach,
        confidence_score: confidence_score,
      }),
      findSimilarPatterns: async () => [],
      explainRecommendationReasoning: async () => '',
      evaluatePatternRelevance: async () => 0,
    };

    const mock_db = {
      records: [] as Array<{
        recommendation_id: string;
        proposal_approach: string;
        confidence_score: number;
        customer_name: string;
        industry: string;
        budget: string;
        challenge: string;
        timestamp: string;
      }>,
      saveRecommendationHistory: function(record: any) {
        this.records.push(record);
      },
      getRecommendationHistory: function() {
        return this.records;
      },
    };

    const input_condition = {
      customer_name: customer_name,
      industry: industry,
      budget: budget,
      challenge: challenge,
    };

    const first_execution_result = await generateRecommendation(
      input_condition,
      mock_ai_engine,
      mock_db
    );

    expect(first_execution_result.recommendation_id).toBe('REC-2024-001');
    expect(first_execution_result.proposal_approach).toBe('クラウド統合戦略');
    expect(first_execution_result.confidence_score).toBe(0.92);

    const first_history = mock_db.getRecommendationHistory();
    expect(first_history.length).toBe(1);
    const first_record = first_history[0];
    expect(first_record.recommendation_id).toBe('REC-2024-001');
    expect(first_record.proposal_approach).toBe('クラウド統合戦略');
    expect(first_record.confidence_score).toBe(0.92);
    expect(first_record.customer_name).toBe('テスト顧客A');
    expect(first_record.industry).toBe('IT');
    expect(first_record.budget).toBe('500万円');
    expect(first_record.challenge).toBe('システム統合');
    const first_timestamp = first_record.timestamp;

    const second_execution_result = await generateRecommendation(
      input_condition,
      mock_ai_engine,
      mock_db
    );

    expect(second_execution_result.recommendation_id).toBe('REC-2024-001');
    expect(second_execution_result.proposal_approach).toBe('クラウド統合戦略');
    expect(second_execution_result.confidence_score).toBe(0.92);

    const second_history = mock_db.getRecommendationHistory();
    expect(second_history.length).toBe(2);
    const second_record = second_history[1];
    expect(second_record.recommendation_id).toBe('REC-2024-001');
    expect(second_record.proposal_approach).toBe('クラウド統合戦略');
    expect(second_record.confidence_score).toBe(0.92);
    expect(second_record.customer_name).toBe('テスト顧客A');
    expect(second_record.industry).toBe('IT');
    expect(second_record.budget).toBe('500万円');
    expect(second_record.challenge).toBe('システム統合');
    const second_timestamp = second_record.timestamp;

    expect(first_record.recommendation_id).toBe(second_record.recommendation_id);
    expect(first_record.proposal_approach).toBe(second_record.proposal_approach);
    expect(first_record.confidence_score).toBe(second_record.confidence_score);
    expect(first_record.customer_name).toBe(second_record.customer_name);
    expect(first_record.industry).toBe(second_record.industry);
    expect(first_record.budget).toBe(second_record.budget);
    expect(first_record.challenge).toBe(second_record.challenge);
    expect(first_timestamp).not.toBe(second_timestamp);
  });
});