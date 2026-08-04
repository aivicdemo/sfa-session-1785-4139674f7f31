import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-143
  test('根拠情報が0件のときに空状態として可視化される', () => {
    // Arrange: AIRecommendationEngineのexplainRecommendationReasoningメソッドをスタブ化
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue([]),
    };

    const recommendationId = 'rec-12345';
    const expectedEmptyState = {
      hasReasons: false,
      reasons: [],
      emptyStateMessage: expect.stringMatching(
        /根拠情報がありません|利用可能な根拠がありません/
      ),
    };

    // Act: 推奨根拠の可視化を実行し、空配列が返されることを確認
    return explainRecommendationReasoning(
      recommendationId,
      mockAIRecommendationEngine
    ).then((result) => {
      // Assert: 根拠情報が0件の場合の空状態表示を確認
      expect(result.reasons).toEqual([]);
      expect(result.reasons.length).toBe(0);
      expect(result.hasReasons).toBe(false);
      expect(result.emptyStateMessage).toBeDefined();
      expect(result.emptyStateMessage).toMatch(
        /根拠情報がありません|利用可能な根拠がありません/
      );

      // 根拠情報リストが存在しない、または非表示になっていることを確認
      if (result.listElement) {
        expect(result.listElement.style.display).toBe('none');
      }

      // 空状態プレースホルダーが表示されていることを確認
      expect(result.emptyStatePlaceholder).toBeDefined();
      expect(result.emptyStatePlaceholder.className).toMatch(/emptyState/);
    });
  });
});