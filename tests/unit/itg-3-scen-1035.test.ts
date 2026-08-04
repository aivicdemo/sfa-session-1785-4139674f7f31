import { evaluateProposalApproachRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチの推奨判定', () => {
  test('SCEN-1035: 提案アプローチが1件の場合、適用可能性スコアに基づいて判定ステータスが決定される', () => {
    // Arrange: テスト対象の新規案件条件を準備
    const newDealCondition = {
      customerIndustry: '製造業',
      mainIssue: 'コスト削減',
      budgetScale: '中規模',
    };

    // 提案アプローチ（1件のみ）
    const proposalApproach = {
      approachId: 'APP-001',
      approachName: 'コスト削減ソリューション提案',
      targetIndustry: '製造業',
      targetIssue: 'コスト削減',
      description: '製造業向けコスト削減ソリューション',
    };

    // AIRecommendationEngineのスタブを設定
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((approach, dealCondition) => {
        // 適用可能性スコア 0.75 を返却（0.7以上なので「適用可能」）
        return 0.75;
      }),
    };

    // Act: 推奨判定エンジンの処理を実行
    const result = evaluateProposalApproachRelevance(
      proposalApproach,
      newDealCondition,
      mockAIEngine
    );

    // Assert: 判定結果を検証
    expect(result).toEqual({
      approachId: 'APP-001',
      relevanceScore: 0.75,
      judgmentStatus: '適用可能',
      reasoning: expect.any(String),
    });

    // スコア0.75 >= 0.7 であることを確認
    expect(result.relevanceScore).toBeGreaterThanOrEqual(0.7);
    expect(result.judgmentStatus).toBe('適用可能');
    expect(result.reasoning).toMatch(/製造業|コスト削減/);

    // AIエンジンが呼び出されたことを確認
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      proposalApproach,
      newDealCondition
    );
  });
});