import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-871
  test('推奨信頼度スコア算出機能 - 類似度スコアが小数第2位で端数が出るとき正しく丸められる', () => {
    const similarityScore = 0.335;
    
    const result = evaluatePatternRelevance({
      similarityScore: similarityScore,
      patternId: 'pattern_test_001',
      customerAttributes: {
        industry: 'technology',
        employeeCount: 500
      },
      dealConditions: {
        dealValue: 100000,
        dealStage: 'proposal'
      }
    });

    expect(result.recommendationConfidenceScore).toBe(0.34);
    expect(typeof result.recommendationConfidenceScore).toBe('number');
  });
});