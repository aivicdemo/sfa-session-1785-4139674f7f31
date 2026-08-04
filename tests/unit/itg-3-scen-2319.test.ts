import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-2319
  test('新規案件と過去成功パターンの類似度スコアがちょうど適用可能閾値のとき提案アプローチが推奨される', () => {
    // Arrange: 新規案件データの準備
    const newDealData = {
      customerIndustry: '製造業',
      dealSize: 5000000,
      decisionMakers: 3,
      evaluationPeriodDays: 60,
    };

    // 過去成功パターンのモック
    const similarPatterns = [
      {
        patternId: 'pattern_001',
        industry: '製造業',
        dealSize: 4800000,
        successRate: 0.85,
        approachSteps: [
          '初期商談での経営課題ヒアリング',
          'ROI試算提示',
          '段階的導入提案',
        ],
      },
    ];

    // 類似度スコア: 適用可能閾値と同じ値（0.75）
    const relevanceScore = 0.75;
    const applicabilityThreshold = 0.75;

    // Act: evaluatePatternRelevance 関数を呼び出し
    const recommendationResult = evaluatePatternRelevance({
      newDeal: newDealData,
      patterns: similarPatterns,
      relevanceScore: relevanceScore,
      threshold: applicabilityThreshold,
    });

    // Assert: 推奨内容の検証
    expect(recommendationResult.status).toBe('適用推奨');
    expect(recommendationResult.proposalApproaches).toEqual([
      '初期商談での経営課題ヒアリング',
      'ROI試算提示',
      '段階的導入提案',
    ]);
    expect(recommendationResult.rationale).toMatch(
      /過去の類似案件.*同業種.*同規模.*成功率.*80%/
    );
    expect(recommendationResult.relevanceScore).toBe(0.75);
  });
});