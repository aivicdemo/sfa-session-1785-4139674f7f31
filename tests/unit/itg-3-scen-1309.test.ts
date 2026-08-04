import { evaluateGoalAlignment } from '../../src/logic/it-1-br-3-1-1-1';

const AIRecommendationEngineStub = {
  evaluatePatternRelevance: jest.fn(),
};

describe('AIエージェント推奨根拠の可視化機能 - 提案内容と顧客制約条件の照合', () => {
  test('SCEN-1309: 提案内容が顧客の経営目標と合致するとき、目標適合度が数値化される', () => {
    // Arrange: 顧客情報を準備
    const customerID = 'CUST-2024-001';
    const proposalID = 'PROP-2024-0567';
    const customerGoals = ['売上20%増加', 'コスト削減15%', 'デジタル化推進'];
    const proposalContent = ['クラウドシステム導入', 'プロセス自動化', 'ダッシュボード構築'];

    // AIRecommendationEngineをスタブ化し、戻り値を設定
    AIRecommendationEngineStub.evaluatePatternRelevance.mockReturnValue({
      patternRelevanceScore: 0.87,
      matchedGoals: ['売上20%増加', 'デジタル化推進'],
      unmatchedGoals: ['コスト削減15%'],
    });

    // Act: 提案内容と顧客経営目標の照合機能を実行
    const result = evaluateGoalAlignment(
      customerID,
      proposalID,
      customerGoals,
      proposalContent,
      AIRecommendationEngineStub
    );

    // Assert: 期待値の計算
    // 適合ゴール数2 ÷ 全ゴール数3 = 0.67
    // AIスコア0.87を使用した加重平均: (0.67 + 0.87) / 2 = 0.77
    const expectedGoalAlignmentScore = 0.77;

    // 戻り値の構造と具体的な数値を検証
    expect(result).toEqual({
      goalAlignmentScore: expectedGoalAlignmentScore,
      alignmentDetails: {
        matchedGoalsCount: 2,
        totalGoalsCount: 3,
        matchedGoalsList: ['売上20%増加', 'デジタル化推進'],
        unmatchedGoalsList: ['コスト削減15%'],
      },
      confidenceLevel: 'HIGH',
    });

    // スコアが小数第2位までの具体的な数値であることを確認
    expect(result.goalAlignmentScore).toBe(0.77);
    expect(Number.isFinite(result.goalAlignmentScore)).toBe(true);
  });
});