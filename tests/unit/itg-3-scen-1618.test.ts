import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1618
  test('OpenAI API接続エラー時に内部推奨パターンマスタから統計的上位パターンを根拠として返却する', () => {
    // Setup: AIRecommendationEngine のスタブ定義
    const mockAIEngine = {
      generateRecommendation: jest.fn()
        .mockRejectedValueOnce(new Error('Connection timeout'))
        .mockRejectedValueOnce(new Error('Connection timeout'))
        .mockRejectedValueOnce(new Error('Connection timeout')),
      explainRecommendationReasoning: jest.fn(),
    };

    // Setup: 推奨パターンマスタのスタブデータ
    const mockRecommendationPatterns = [
      {
        pattern_id: 'PATTERN_A',
        pattern_name: 'パターンA',
        success_rate: 85,
        applied_cases: 42,
      },
      {
        pattern_id: 'PATTERN_B',
        pattern_name: 'パターンB',
        success_rate: 72,
        applied_cases: 28,
      },
      {
        pattern_id: 'PATTERN_C',
        pattern_name: 'パターンC',
        success_rate: 68,
        applied_cases: 15,
      },
    ];

    // Setup: 新規案件データ
    const newCaseInput = {
      customer_industry: '製造業',
      case_amount: 5000000,
      decision_makers_count: 3,
    };

    // Execute
    const result = generateRecommendationWithFallback(
      newCaseInput,
      mockAIEngine,
      mockRecommendationPatterns
    );

    // Verify: API呼び出し失敗を3回試みたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    // Verify: 自然言語説明生成ロジックが呼び出されていないことを確認
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();

    // Verify: 返却された推奨結果の構造を確認
    expect(result).toHaveProperty('recommendation_pattern_name');
    expect(result).toHaveProperty('success_rate');
    expect(result).toHaveProperty('applied_cases');
    expect(result).toHaveProperty('reasoning_explanation');
    expect(result).toHaveProperty('user_message');
    expect(result).toHaveProperty('reasoning_detail_level');

    // Verify: 統計的上位パターン（パターンA）が選択されていることを確認
    expect(result.recommendation_pattern_name).toBe('パターンA');
    expect(result.success_rate).toBe(85);
    expect(result.applied_cases).toBe(42);

    // Verify: 簡略版の根拠説明が含まれていることを確認
    expect(result.reasoning_explanation).toBe(
      '過去の類似案件においてこのアプローチが最も高い成功率を示しています'
    );

    // Verify: ユーザーに表示されるメッセージを確認
    expect(result.user_message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    // Verify: 根拠の詳細レベルが簡略版であることを確認
    expect(result.reasoning_detail_level).toBe('simplified');
  });
});