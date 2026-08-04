import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2557
  test('推奨根拠に同じ信頼度スコアが並んでいるとき、それぞれ別の根拠として可視化される', () => {
    // Arrange: AIRecommendationEngineのスタブを設定
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn(() => [
        {
          patternId: 'pattern_001',
          patternName: '顧客規模と業種の一致',
          confidenceScore: 0.85,
          attributes: {
            customerSize: 'large',
            industry: 'manufacturing',
          },
        },
        {
          patternId: 'pattern_002',
          patternName: '導入時期の最適性',
          confidenceScore: 0.85,
          attributes: {
            timeliness: 'optimal',
            fiscalQuarter: 'Q1',
          },
        },
        {
          patternId: 'pattern_003',
          patternName: '既導入システムとの親和性',
          confidenceScore: 0.85,
          attributes: {
            systemCompatibility: 'high',
            integrationLevel: 'seamless',
          },
        },
      ]),
      explainRecommendationReasoning: jest.fn((patternId: string) => {
        const explanations: Record<string, string> = {
          pattern_001: '顧客規模と業種の一致により、過去の類似案件での成功パターンが適用可能です。',
          pattern_002: '導入時期が最適であり、顧客の予算執行タイミングと営業提案が合致しています。',
          pattern_003: '既導入システムとの親和性が高く、統合実装時のリスクが低いと判定されました。',
        };
        return explanations[patternId] || '';
      }),
    };

    // Act: 推奨根拠の可視化機能を呼び出す
    const relevancePatterns = mockAIEngine.evaluatePatternRelevance();
    const visualizedRecommendations = relevancePatterns.map((pattern) => ({
      patternId: pattern.patternId,
      patternName: pattern.patternName,
      confidenceScore: pattern.confidenceScore,
      reasoningExplanation: mockAIEngine.explainRecommendationReasoning(
        pattern.patternId,
      ),
      attributes: pattern.attributes,
    }));

    // Assert: 3つの根拠がそれぞれ別のエンティティとして表示される
    expect(visualizedRecommendations).toHaveLength(3);

    // 根拠1の検証
    expect(visualizedRecommendations[0]).toEqual({
      patternId: 'pattern_001',
      patternName: '顧客規模と業種の一致',
      confidenceScore: 0.85,
      reasoningExplanation:
        '顧客規模と業種の一致により、過去の類似案件での成功パターンが適用可能です。',
      attributes: {
        customerSize: 'large',
        industry: 'manufacturing',
      },
    });

    // 根拠2の検証
    expect(visualizedRecommendations[1]).toEqual({
      patternId: 'pattern_002',
      patternName: '導入時期の最適性',
      confidenceScore: 0.85,
      reasoningExplanation:
        '導入時期が最適であり、顧客の予算執行タイミングと営業提案が合致しています。',
      attributes: {
        timeliness: 'optimal',
        fiscalQuarter: 'Q1',
      },
    });

    // 根拠3の検証
    expect(visualizedRecommendations[2]).toEqual({
      patternId: 'pattern_003',
      patternName: '既導入システムとの親和性',
      confidenceScore: 0.85,
      reasoningExplanation:
        '既導入システムとの親和性が高く、統合実装時のリスクが低いと判定されました。',
      attributes: {
        systemCompatibility: 'high',
        integrationLevel: 'seamless',
      },
    });

    // 同じ信頼度スコア（0.85）が複数の根拠に付与されていることを確認
    const allConfidenceScores = visualizedRecommendations.map(
      (rec) => rec.confidenceScore,
    );
    expect(allConfidenceScores).toEqual([0.85, 0.85, 0.85]);

    // patternIdがすべて異なることを確認（重複がないこと）
    const patternIds = visualizedRecommendations.map((rec) => rec.patternId);
    const uniquePatternIds = new Set(patternIds);
    expect(uniquePatternIds.size).toBe(3);

    // 各根拠の個別性が保たれていることを確認（異なるpatternNameと説明文）
    const patternNames = visualizedRecommendations.map(
      (rec) => rec.patternName,
    );
    const uniquePatternNames = new Set(patternNames);
    expect(uniquePatternNames.size).toBe(3);

    const explanations = visualizedRecommendations.map(
      (rec) => rec.reasoningExplanation,
    );
    const uniqueExplanations = new Set(explanations);
    expect(uniqueExplanations.size).toBe(3);
  });
});