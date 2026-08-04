import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2677
  test('推奨根拠の文字列が業務上最大規模（10000文字超）のとき、全文が出力される', () => {
    const base_text = 'a';
    const large_reasoning_text = base_text.repeat(10500);
    
    const mock_engine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockReturnValue(large_reasoning_text),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = explainRecommendationReasoning(
      {
        customer_id: 'CUST-001',
        deal_id: 'DEAL-12345',
        recommendation_id: 'REC-99999',
      },
      mock_engine
    );

    expect(result.length).toBe(10500);
    expect(result).toBe(large_reasoning_text);
    
    const first_100 = result.substring(0, 100);
    const expected_first_100 = large_reasoning_text.substring(0, 100);
    expect(first_100).toBe(expected_first_100);
    
    const last_100 = result.substring(result.length - 100);
    const expected_last_100 = large_reasoning_text.substring(large_reasoning_text.length - 100);
    expect(last_100).toBe(expected_last_100);
    
    expect(result).not.toContain('...');
    
    const contains_truncation_markers = /\.\.\.|省略|截断|cut off/i.test(result);
    expect(contains_truncation_markers).toBe(false);
    
    expect(result).toEqual(large_reasoning_text);
  });
});