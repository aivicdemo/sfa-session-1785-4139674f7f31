import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2217: 異常パターン検出時に検出理由が明示される', async () => {
    // Arrange: AIRecommendationEngineのスタブを構成
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        anomalyDetected: true,
        anomalyReason: 'PATTERN_MISMATCH',
        similarityScore: 35,
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        '過去成功事例との顧客規模差が大きい（類似度35%）ため、通常の提案パターンではなく中堅企業向けカスタマイズアプローチを推奨します'
      ),
    };

    // テスト用の商談条件データを構成
    const dealCondition = {
      customerIndustry: '製造業',
      budgetAmount: 5000000,
      dealStage: '提案前',
    };

    // Act: explainRecommendationReasoning()を呼び出し
    const explanationResult = await explainRecommendationReasoning(
      mockAIEngine,
      dealCondition
    );

    // Assert: 異常理由説明文が返されていることを確認
    expect(explanationResult).toBeDefined();
    expect(typeof explanationResult).toBe('string');

    // 具体的な検出理由が含まれていることをアサート
    expect(explanationResult).toMatch(/過去成功事例との顧客規模差が大きい/);
    expect(explanationResult).toMatch(/類似度35%/);
    expect(explanationResult).toMatch(/中堅企業向けカスタマイズアプローチ/);

    // スタブが正しく呼ばれたことを確認
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      dealCondition
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith({
      anomalyDetected: true,
      anomalyReason: 'PATTERN_MISMATCH',
      similarityScore: 35,
    });

    // UI表示用のメッセージフォーマットを検証
    const uiDisplayMessage = `異常パターン検出: ${explanationResult}`;
    expect(uiDisplayMessage).toContain('異常パターン検出:');
    expect(uiDisplayMessage).toContain('類似度35%');
    expect(uiDisplayMessage).toContain('中堅企業向けカスタマイズアプローチ');
  });
});