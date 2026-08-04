import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-1933: 根拠データのタイムスタンプが欠落しているときに表示処理がスキップされる', () => {
    // Arrange: AIRecommendationEngine のスタブを設定
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(),
    };

    // 根拠データ（タイムスタンプなし）を準備
    const recommendationId = 'rec-12345';
    const reasoningDataWithoutTimestamp = {
      recommendationId: 'rec-12345',
      customerName: 'Test Customer Inc.',
      industry: 'Technology',
      recommendedApproach: 'Direct proposal with ROI focus',
      supportingEvidence: [
        {
          type: 'similar_case',
          caseId: 'case-001',
          matchScore: 0.87,
          // timestamp は意図的に欠落
          description: 'Similar technology company with 500+ employees',
        },
      ],
      confidenceScore: 85,
      // timestamp を null に設定してエッジケースを再現
      generatedAt: null,
    };

    mockAIEngine.explainRecommendationReasoning.mockReturnValue(
      reasoningDataWithoutTimestamp
    );

    // UIレンダリング用のモック（根拠表示がスキップされるか確認）
    const mockRenderReasoningUI = jest.fn();
    const mockLogWarning = jest.fn();

    // Act: 根拠表示機能を実行
    const result = explainRecommendationReasoning(recommendationId, {
      AIEngine: mockAIEngine,
      renderUI: mockRenderReasoningUI,
      logWarning: mockLogWarning,
    });

    // Assert: 根拠表示処理がスキップされたことを確認
    // タイムスタンプがない場合、UI描画は呼び出されない
    expect(mockRenderReasoningUI).not.toHaveBeenCalled();

    // 警告ログは出力されない（静かにスキップ）
    expect(mockLogWarning).not.toHaveBeenCalled();

    // 推奨内容は返されるが、根拠セクションは空
    expect(result).toEqual({
      recommendationId: 'rec-12345',
      customerName: 'Test Customer Inc.',
      industry: 'Technology',
      recommendedApproach: 'Direct proposal with ROI focus',
      confidenceScore: 85,
      reasoningExplained: false,
      reasoningDetails: null,
    });

    // AIエンジンへの呼び出しは正確に1回だけ（再試行なし）
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      'rec-12345'
    );
  });
});