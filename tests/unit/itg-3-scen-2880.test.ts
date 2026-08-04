import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨内容検証判定機能 - AIRecommendationEngine失敗時の代替処理', () => {
  // SCEN-2880
  test('AIRecommendationEngine.generateRecommendation失敗時に推奨パターンマスタから統計上位パターンを返す', async () => {
    // Arrange: AIRecommendationEngine のスタブ（失敗シミュレーション）
    const failingAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValueOnce(
        new Error('API_TIMEOUT')
      ),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // Arrange: 推奨パターンマスタ（統計上位順）
    const recommendationPatternMaster = [
      {
        pattern_id: 'PATTERN_A',
        pattern_name: 'パターンA',
        success_rate: 85,
        case_count: 120
      },
      {
        pattern_id: 'PATTERN_B',
        pattern_name: 'パターンB',
        success_rate: 78,
        case_count: 95
      },
      {
        pattern_id: 'PATTERN_C',
        pattern_name: 'パターンC',
        success_rate: 72,
        case_count: 50
      }
    ];

    // Arrange: 新規案件データ
    const newDealData = {
      customer_industry: '製造業',
      budget_range: '5000000',
      decision_makers_count: 3
    };

    // Arrange: ログ記録のモック
    const logOutput: string[] = [];
    const mockLogger = {
      error: jest.fn((msg: string) => {
        logOutput.push(msg);
      })
    };

    // Act
    const result = await generateRecommendationWithFallback(
      newDealData,
      failingAIEngine,
      recommendationPatternMaster,
      mockLogger
    );

    // Assert: 代替パターンマスタから統計上位パターンAが返却される
    expect(result.pattern_id).toBe('PATTERN_A');
    expect(result.pattern_name).toBe('パターンA');
    expect(result.success_rate).toBe(85);
    expect(result.case_count).toBe(120);

    // Assert: 根拠説明は簡略版
    expect(result.reasoning_summary).toBe('過去の成功実績に基づいて推奨します');

    // Assert: ユーザーメッセージが含まれる
    expect(result.user_message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    // Assert: エラーログに代替処理実行が記録される
    expect(mockLogger.error).toHaveBeenCalled();
    expect(logOutput[0]).toMatch(/AIRecommendationEngine\.generateRecommendation.*失敗.*代替パターン取得処理/);

    // Assert: AIエンジンが呼び出されたことを確認
    expect(failingAIEngine.generateRecommendation).toHaveBeenCalledWith(
      newDealData
    );
  });
});