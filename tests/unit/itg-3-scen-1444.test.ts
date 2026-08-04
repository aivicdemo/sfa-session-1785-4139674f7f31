import { visualizeRecommendationReason } from '../../src/logic/it-1-br-3-1-1-1';

interface SuccessPattern {
  patternId: string;
  customerSize: string;
  industry: string;
  proposalAmount: number;
  closureRate: number;
}

interface PatternRelevanceResult {
  patternId: string;
  relevanceScore: number;
}

interface ExplanationResult {
  explanation: string;
}

interface RecommendationReasoning {
  similarPatterns: SuccessPattern[];
  relevanceScores: PatternRelevanceResult[];
  explanations: ExplanationResult[];
}

interface ReasonVisualizationResult {
  isVisible: boolean;
  patternId: string;
  relevanceScorePercentage: number;
  customerSize: string;
  industry: string;
  proposalAmount: number;
  explanation: string;
}

describe('AIエージェント推奨根拠の可視化機能', () => {
  test('SCEN-1444: 推奨根拠が1件のとき、根拠が可視化される', () => {
    // Arrange: AIRecommendationEngineのスタブを用意
    const mockFindSimilarPatterns = jest.fn(
      (): SuccessPattern[] => [
        {
          patternId: 'PATTERN-001',
          customerSize: '中堅企業',
          industry: '製造業',
          proposalAmount: 5000000,
          closureRate: 0.85,
        },
      ]
    );

    const mockEvaluatePatternRelevance = jest.fn(
      (patternId: string): number => {
        if (patternId === 'PATTERN-001') {
          return 0.92;
        }
        return 0;
      }
    );

    const mockExplainRecommendationReasoning = jest.fn(
      (): string =>
        '本案件は過去事例PATTERN-001と顧客規模・業種・予算帯が合致しており、同じアプローチで成約率85%の実績があります'
    );

    const stubAIEngine = {
      findSimilarPatterns: mockFindSimilarPatterns,
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
      explainRecommendationReasoning: mockExplainRecommendationReasoning,
    };

    const recommendationData: RecommendationReasoning = {
      similarPatterns: mockFindSimilarPatterns(),
      relevanceScores: mockFindSimilarPatterns().map((pattern) => ({
        patternId: pattern.patternId,
        relevanceScore: mockEvaluatePatternRelevance(pattern.patternId),
      })),
      explanations: [
        {
          explanation: mockExplainRecommendationReasoning(),
        },
      ],
    };

    // Act: 推奨ビューコンポーネントに推奨根拠データを渡して可視化を実行
    const result: ReasonVisualizationResult = visualizeRecommendationReason(
      recommendationData,
      stubAIEngine
    );

    // Assert: 根拠表示エリアが存在することを確認
    expect(result.isVisible).toBe(true);

    // Assert: パターンIDが可視化されていることを確認
    expect(result.patternId).toBe('PATTERN-001');

    // Assert: 適用可能スコアがパーセンテージ表記（92%）で可視化されていることを確認
    expect(result.relevanceScorePercentage).toBe(92);

    // Assert: 顧客規模が表示されていることを確認
    expect(result.customerSize).toBe('中堅企業');

    // Assert: 業種が表示されていることを確認
    expect(result.industry).toBe('製造業');

    // Assert: 提案額が表示されていることを確認
    expect(result.proposalAmount).toBe(5000000);

    // Assert: 説明文が正確に表示されていることを確認
    expect(result.explanation).toBe(
      '本案件は過去事例PATTERN-001と顧客規模・業種・予算帯が合致しており、同じアプローチで成約率85%の実績があります'
    );
  });
});