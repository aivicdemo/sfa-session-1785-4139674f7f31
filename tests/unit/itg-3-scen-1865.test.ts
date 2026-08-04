import { displayRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1865
  test('根拠となる成功パターンデータが null のとき根拠表示に失敗する', () => {
    // Arrange: AIRecommendationEngine のスタブを準備
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockReturnValue(null),
      explainRecommendationReasoning: jest.fn().mockReturnValue('簡略版根拠説明'),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockLogger = {
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    };

    const mockPatternMaster = [
      {
        id: 'pattern-001',
        name: '高成長企業向け提案',
        successRate: 0.85,
        applicableIndustries: ['IT', 'FinTech'],
        description: '統計的に上位の成功パターン',
      },
    ];

    // Act: 成功パターンデータとして null を渡して推奨内容の根拠表示機能を呼び出す
    const result = displayRecommendationReasoning(
      {
        recommendationId: 'rec-12345',
        customerId: 'cust-789',
        successPatternData: null,
        recommendedAction: 'フォローアップメール送信',
        confidenceScore: 78,
      },
      mockAIEngine,
      mockLogger,
      mockPatternMaster
    );

    // Assert: explainRecommendationReasoning メソッドが呼び出されることを確認
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalled();

    // Assert: エラーログに『成功パターンデータがnullのため根拠説明の生成に失敗しました』というメッセージが記録される
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('成功パターンデータがnullのため根拠説明の生成に失敗しました')
    );

    // Assert: UI上で『根拠を表示できません』というエラーメッセージが表示される
    expect(result.uiMessage).toBe('根拠を表示できません');

    // Assert: 代替動作として『推奨パターンマスタから統計的に上位の成功パターンを返却し、簡略版根拠説明を表示する』処理に遷移
    expect(result.fallbackMode).toBe(true);
    expect(result.displayedReasoning).toBe('簡略版根拠説明');
    expect(result.usedPatternFromMaster).toBe(true);
    expect(result.alternativePattern).toEqual({
      id: 'pattern-001',
      name: '高成長企業向け提案',
      successRate: 0.85,
      applicableIndustries: ['IT', 'FinTech'],
      description: '統計的に上位の成功パターン',
    });
  });
});