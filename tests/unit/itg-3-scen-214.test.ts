import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-214
  test('複数の根拠要因に基づいた説明文が統合されて生成される', async () => {
    // Arrange: AIRecommendationEngineのスタブ初期化
    const mockFindSimilarPatterns = jest.fn().mockResolvedValue([
      {
        patternId: 'pattern-a',
        customerSize: '中堅',
        itBudget: '充実',
        successRate: 0.82,
      },
      {
        patternId: 'pattern-b',
        industry: '製造業',
        dxStatus: '推進中',
        roiAchievementMonths: 6,
      },
      {
        patternId: 'pattern-c',
        proposalAmount: 5000000,
        averageDaysToClose: 35,
      },
    ]);

    const mockEvaluatePatternRelevance = jest.fn()
      .mockResolvedValueOnce({ score: 0.85, patternId: 'pattern-a' })
      .mockResolvedValueOnce({ score: 0.78, patternId: 'pattern-b' })
      .mockResolvedValueOnce({ score: 0.72, patternId: 'pattern-c' });

    const mockExplainRecommendationReasoning = jest.fn()
      .mockResolvedValueOnce({
        patternId: 'pattern-a',
        explanation: '過去3年間で同規模顧客への導入成功率は82%と高く、予算承認プロセスが確立している傾向が見られます',
      })
      .mockResolvedValueOnce({
        patternId: 'pattern-b',
        explanation: '製造業DX推進企業への提案では、導入後ROI達成期間が平均6ヶ月と短く、経営層の意思決定が迅速です',
      })
      .mockResolvedValueOnce({
        patternId: 'pattern-c',
        explanation: '500万円以上の提案では、営業ステージが見積提示段階で成約まで平均35日と効率的です',
      });

    const mockAIEngine = {
      findSimilarPatterns: mockFindSimilarPatterns,
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
      explainRecommendationReasoning: mockExplainRecommendationReasoning,
    };

    const newCaseData = {
      customerSize: '中堅',
      industry: '製造業',
      proposalAmount: 6500000,
    };

    // Act: 推奨根拠の統合説明文を生成
    const result = await explainRecommendationReasoning(
      newCaseData,
      mockAIEngine
    );

    // Assert: 生成された根拠説明文の内容確認
    expect(result).toBeDefined();
    expect(result.integratedExplanation).toBeDefined();
    expect(typeof result.integratedExplanation).toBe('string');

    // 3つの根拠要因が統合されているか確認
    expect(result.integratedExplanation).toMatch(/同規模顧客/);
    expect(result.integratedExplanation).toMatch(/成功率/);
    expect(result.integratedExplanation).toMatch(/予算承認/);
    expect(result.integratedExplanation).toMatch(/製造業/);
    expect(result.integratedExplanation).toMatch(/ROI達成/);
    expect(result.integratedExplanation).toMatch(/6ヶ月/);
    expect(result.integratedExplanation).toMatch(/営業効率/);
    expect(result.integratedExplanation).toMatch(/35日/);

    // 統合根拠が単なる列挙ではなく、自然に接続された文章であることを確認
    expect(result.integratedExplanation.length).toBeGreaterThan(100);
    expect(result.integratedExplanation).toContain('かつ');
    expect(result.integratedExplanation).toContain('さらに');

    // パターンごとのスコアと根拠が含まれているか確認
    expect(result.patternScores).toEqual([
      { patternId: 'pattern-a', score: 0.85 },
      { patternId: 'pattern-b', score: 0.78 },
      { patternId: 'pattern-c', score: 0.72 },
    ]);

    // スタブが正しく呼び出されたか確認
    expect(mockFindSimilarPatterns).toHaveBeenCalledWith(newCaseData);
    expect(mockEvaluatePatternRelevance).toHaveBeenCalledTimes(3);
    expect(mockExplainRecommendationReasoning).toHaveBeenCalledTimes(3);
  });
});