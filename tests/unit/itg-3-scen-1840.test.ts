import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠可視化機能', () => {
  test('SCEN-1840: 過去事例データが0件のとき根拠情報の生成に失敗する', () => {
    // Arrange: AIRecommendationEngineスタブを過去事例データ0件で設定
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockRejectedValueOnce(
        new Error('No historical cases available for reasoning')
      ),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValueOnce([]),
      evaluatePatternRelevance: jest.fn(),
    };

    // 推奨パターンマスタのスタブ（統計的に上位の成功パターン）
    const fallbackSuccessPatterns = [
      {
        pattern_id: 'pat_001',
        success_rate: 85,
        description: '初期接触後1週間以内のフォローアップ',
        applicability_score: 92,
      },
      {
        pattern_id: 'pat_002',
        success_rate: 78,
        description: '顧客ニーズヒアリング後の提案資料送付',
        applicability_score: 88,
      },
    ];

    const newDealInfo = {
      customer_id: 'cust_123',
      customer_name: 'テスト株式会社',
      industry: 'IT',
      company_size: 'mid_market',
      deal_conditions: 'Budget approval required',
      sales_stage: 'proposal',
    };

    // Act: 推奨根拠の生成を実行
    const resultPromise = explainRecommendationReasoning(
      newDealInfo,
      mockAIEngine,
      fallbackSuccessPatterns
    );

    // Assert: 期待結果の検証
    return resultPromise.then(result => {
      // (1) explainRecommendationReasoningメソッドがエラーから回復し、フォールバック結果を返す
      expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
        newDealInfo
      );

      // (2) UI表示用メッセージが指定されている
      expect(result.ui_message).toBe(
        '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
      );

      // (3) フォールバック根拠説明が簡略版として返される
      expect(result.fallback_enabled).toBe(true);
      expect(result.reasoning_summary).toBeDefined();
      expect(typeof result.reasoning_summary).toBe('string');
      expect(result.reasoning_summary.length).toBeGreaterThan(0);

      // (4) 推奨パターンマスタから統計的に上位のパターンが含まれている
      expect(result.fallback_patterns).toBeDefined();
      expect(Array.isArray(result.fallback_patterns)).toBe(true);
      expect(result.fallback_patterns.length).toBeGreaterThan(0);
      expect(result.fallback_patterns[0].success_rate).toBeGreaterThanOrEqual(
        78
      );

      // (5) エラーログが記録されている
      expect(result.error_logged).toBe(true);
      expect(result.error_message).toMatch(/過去事例|データ|利用不可|生成失敗/i);

      // (6) 最終的には根拠情報が提供され、UIが正常に表示される
      expect(result.recommendation_reasoning_available).toBe(true);
    });
  });
});