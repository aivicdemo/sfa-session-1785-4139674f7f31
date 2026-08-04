import { calculateRecommendationRelevanceScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1626
  test('[normal] 推奨妥当性スコア算出機能 - 購買履歴が0件で提案内容1件の場合、最小スコアが算出される', () => {
    const purchase_history: any[] = [];
    const proposal_content = {
      proposal_id: 'PROP-001',
      proposal_category: '標準提案',
    };

    const mock_ai_engine = {
      evaluatePatternRelevance: jest.fn(() => 0.0),
    };

    const result = calculateRecommendationRelevanceScore(
      purchase_history,
      proposal_content,
      mock_ai_engine
    );

    expect(result).toEqual({
      score: 0.0,
      log_entry: '購買履歴なしのため最小スコアを適用',
    });
    expect(typeof result.score).toBe('number');
    expect(result.score).toBe(0.0);
  });
});