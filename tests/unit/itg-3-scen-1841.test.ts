import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1841
  test('参照すべき成功パターンが0件のとき根拠情報の生成に失敗し、キャッシュから代替表示される', async () => {
    // Arrange: AIRecommendationEngineのスタブを設定
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest
        .fn()
        .mockRejectedValue(new Error('参照可能な成功パターンが見つかりません')),
      generateRecommendation: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // キャッシュされた過去推奨履歴（推奨パターンマスタから統計的に上位のもの）
    const cachedRecommendationHistory = [
      {
        recommendation_id: 'rec_cache_001',
        customer_id: 'cust_001',
        recommendation_content: '定期購買パターンA',
        confidence_score: 78,
        created_at: '2024-01-10T09:00:00Z',
      },
      {
        recommendation_id: 'rec_cache_002',
        customer_id: 'cust_002',
        recommendation_content: '季節商材提案パターンB',
        confidence_score: 72,
        created_at: '2024-01-08T14:30:00Z',
      },
    ];

    // 新規案件の商談条件
    const dealCondition = {
      customer_name: '新規顧客太郎',
      industry: 'IT',
      budget: 5000000,
      challenge: 'データ分析基盤の構築',
      salesStage: 'initial_contact',
      deaId: 'deal_001',
    };

    // Act: explainRecommendationReasoningを実行
    // 成功パターンが0件の状態でエラーが発生
    const result = await explainRecommendationReasoning(
      dealCondition,
      mockAIEngine,
      cachedRecommendationHistory
    );

    // Assert: エラーメッセージが返され、代替表示用キャッシュが返される
    expect(result).toEqual({
      status: 'fallback',
      user_message:
        '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      reasoning_basis: {
        reasoning_type: 'cached_simplified',
        similar_patterns_count: 0,
        simplified_explanation:
          '統計的に上位の成功パターンから、定期購買パターンAが候補として挙げられます',
        top_cached_recommendations: [
          {
            recommendation_id: 'rec_cache_001',
            recommendation_content: '定期購買パターンA',
            confidence_score: 78,
          },
        ],
      },
      internal_reference: {
        success_pattern_count: 0,
        fallback_source: 'recommendation_master',
        fallback_applied_at: expect.stringMatching(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
        ),
      },
    });

    // AIエージェントの呼び出しが実行されたことを確認
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      dealCondition
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalled();
  });
});