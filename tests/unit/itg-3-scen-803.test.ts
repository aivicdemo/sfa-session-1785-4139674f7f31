import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-803: [normal] 推奨内容と根拠の統合提示機能 - 根拠説明文が自然言語で生成されて返却される', () => {
    // Arrange: スタブの AIRecommendationEngine を作成
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        '貴社の課題であるコスト削減は、過去の成功事例では提案時期がプロジェクト初期段階であり、導入コスト最適化のアプローチが有効でした。現在の商談条件（IT業種、500万円予算）は過去事例と85%の類似度があるため、同様のアプローチを推奨します'
      ),
    };

    // 入力データの準備: 新規案件の顧客情報と過去成功パターン
    const customer_info = {
      industry: 'IT',
      challenge: 'コスト削減',
      budget: 5000000,
    };

    const success_pattern = {
      match_score: 0.85,
      recommendation_content: '導入コスト最適化アプローチ',
    };

    // Act: 推奨内容と根拠の統合提示機能を実行
    const result = explainRecommendationReasoning(
      customer_info,
      success_pattern,
      mockAIRecommendationEngine
    );

    // Assert 1: AIRecommendationEngine.explainRecommendationReasoning() が呼び出されていることを確認
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      customer_info,
      success_pattern
    );

    // Assert 2: スタブから返却された根拠説明文の内容を検証
    const expected_reasoning = '貴社の課題であるコスト削減は、過去の成功事例では提案時期がプロジェクト初期段階であり、導入コスト最適化のアプローチが有効でした。現在の商談条件（IT業種、500万円予算）は過去事例と85%の類似度があるため、同様のアプローチを推奨します';
    expect(result.reasoning_text).toBe(expected_reasoning);

    // Assert 3: 推奨内容と根拠説明文が統合されて返却されたデータを確認
    expect(result).toEqual({
      recommendation_content: '導入コスト最適化アプローチ',
      match_score: 0.85,
      reasoning_text: expected_reasoning,
      integrated_presentation: {
        recommendation: '導入コスト最適化アプローチ',
        confidence_score: 85,
        reasoning: expected_reasoning,
      },
    });
  });
});