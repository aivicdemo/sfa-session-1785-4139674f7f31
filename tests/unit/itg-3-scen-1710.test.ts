import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能', () => {
  test('SCEN-1710: 複数件の提案内容から推奨妥当性スコアを計算する', () => {
    // Arrange: 複数件の提案データを構成
    const proposal1 = {
      id: 'prop_001',
      relevanceScore: 0.92,
      successPatternMatchPercentage: 85,
    };

    const proposal2 = {
      id: 'prop_002',
      relevanceScore: 0.78,
      successPatternMatchPercentage: 72,
    };

    const proposal3 = {
      id: 'prop_003',
      relevanceScore: 0.65,
      successPatternMatchPercentage: 58,
    };

    const proposals = [proposal1, proposal2, proposal3];

    // Act: 推奨妥当性スコア算出機能を実行
    const result = evaluatePatternRelevance(proposals);

    // Assert: 総合スコアが正しく計算されていることを検証
    const expectedAggregateScore = 0.78; // (0.92 + 0.78 + 0.65) / 3 = 0.7833... ≈ 0.78
    expect(result.aggregateScore).toBe(expectedAggregateScore);

    // Assert: 各提案のスコアが正確に算出されていることを検証
    expect(result.individualScores).toEqual([
      { proposalId: 'prop_001', score: 0.92 },
      { proposalId: 'prop_002', score: 0.78 },
      { proposalId: 'prop_003', score: 0.65 },
    ]);

    // Assert: 提案がランキング順（関連度スコアの降順）で正しく順序付けられていることを検証
    expect(result.rankedProposals).toEqual([
      { proposalId: 'prop_001', relevanceScore: 0.92, rank: 1 },
      { proposalId: 'prop_002', relevanceScore: 0.78, rank: 2 },
      { proposalId: 'prop_003', relevanceScore: 0.65, rank: 3 },
    ]);
  });
});