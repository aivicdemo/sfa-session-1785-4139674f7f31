import { visualizeRecommendationRationale } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-2609
  test('推奨パターンの根拠として参照される過去商談件数が複数件の場合、推奨の信頼度が適切に表示される', () => {
    // テスト用の新規案件データを準備
    const newProposal = {
      industry: 'IT',
      budgetAmount: 5000000,
      decisionTimeline: '3ヶ月以内',
      customerId: 'CUST-001',
      proposalId: 'PROP-2609-001'
    };

    // 類似パターンセット - 過去商談件数が5件
    const similarPatterns = [
      {
        patternId: 'PAT-001',
        industry: 'IT',
        budgetRange: '500万～1000万',
        successRate: 0.92,
        referenceCount: 1
      },
      {
        patternId: 'PAT-002',
        industry: 'IT',
        budgetRange: '500万～1000万',
        successRate: 0.88,
        referenceCount: 1
      },
      {
        patternId: 'PAT-003',
        industry: 'IT',
        budgetRange: '500万～1000万',
        successRate: 0.85,
        referenceCount: 1
      },
      {
        patternId: 'PAT-004',
        industry: 'IT',
        budgetRange: '500万～1000万',
        successRate: 0.78,
        referenceCount: 1
      },
      {
        patternId: 'PAT-005',
        industry: 'IT',
        budgetRange: '500万～1000万',
        successRate: 0.72,
        referenceCount: 1
      }
    ];

    // 各パターンの適用可能性スコア
    const patternRelevanceScores = [0.92, 0.88, 0.85, 0.78, 0.72];

    // 推奨根拠の可視化機能を実行
    const result = visualizeRecommendationRationale({
      proposal: newProposal,
      similarPatterns: similarPatterns,
      relevanceScores: patternRelevanceScores
    });

    // 期待値：信頼度スコア = (0.92+0.88+0.85+0.78+0.72)/5 = 0.83
    const expectedConfidenceScore = 83;
    const totalReferencedCount = 5;

    // 信頼度スコアが正確に計算されていることを確認
    expect(result.confidenceScore).toBe(expectedConfidenceScore);

    // 参照された過去商談件数が正確に表示されることを確認
    expect(result.referencedCaseCount).toBe(totalReferencedCount);

    // 詳細説明に参照件数が明記されていることを確認
    expect(result.rationale).toMatch(/5件/);
    expect(result.rationale).toMatch(/過去成功事例/);

    // 視覚的表現（ゲージスコア）が正確に表示されることを確認
    expect(result.confidenceGaugePercentage).toBe(83);

    // 結果構造全体の検証
    expect(result).toEqual({
      confidenceScore: 83,
      referencedCaseCount: 5,
      confidenceGaugePercentage: 83,
      rationale: expect.stringMatching(/5件.*過去成功事例/),
      patterns: expect.arrayContaining([
        expect.objectContaining({
          patternId: expect.any(String),
          relevanceScore: expect.any(Number)
        })
      ])
    });
  });
});