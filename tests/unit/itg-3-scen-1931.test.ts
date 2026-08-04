import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-1931: 根拠情報が1件のときに単一の根拠が表示される', () => {
    // Arrange: AIRecommendationEngineのスタブを設定
    const mockReasonData = {
      id: 'reason-001',
      content: '過去3年間の同業種案件で、提案アプローチA採用時の成約率が78%で最高',
      confidenceScore: 0.92,
      sourcePatternId: 'pattern-2024-001',
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-2024-001',
        proposalApproach: 'アプローチA',
        reasons: [mockReasonData],
        confidenceScore: 0.92,
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanationText: '過去3年間の同業種案件で、提案アプローチA採用時の成約率が78%で最高',
        reasonCount: 1,
        reasons: [
          {
            id: 'reason-001',
            explanation: '過去3年間の同業種案件で、提案アプローチA採用時の成約率が78%で最高',
            confidenceScore: 0.92,
            sourcePatternId: 'pattern-2024-001',
          },
        ],
      }),
    };

    const input = {
      recommendationId: 'rec-2024-001',
      proposalApproach: 'アプローチA',
      reasons: [mockReasonData],
      confidenceScore: 0.92,
    };

    // Act: explainRecommendationReasoningを呼び出し
    const result = explainRecommendationReasoning(input, mockAIEngine);

    // Assert: 根拠情報が正確に1件だけ表示されることを確認
    expect(result).toBeDefined();
    expect(result.reasonCount).toBe(1);
    expect(result.reasons).toHaveLength(1);

    // 根拠情報の内容を確認
    expect(result.reasons[0]).toEqual({
      id: 'reason-001',
      explanation: '過去3年間の同業種案件で、提案アプローチA採用時の成約率が78%で最高',
      confidenceScore: 0.92,
      sourcePatternId: 'pattern-2024-001',
    });

    // 説明文が正確に含まれていることを確認
    expect(result.explanationText).toEqual(
      '過去3年間の同業種案件で、提案アプローチA採用時の成約率が78%で最高'
    );

    // 信頼度スコアが正確に表示されることを確認
    expect(result.reasons[0].confidenceScore).toBe(0.92);

    // モックが正しく呼び出されたことを確認
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(input);
  });
});