import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推論精度スコア算出機能 - 顧客対応パターン分析結果0件時のデフォルト値適用', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
  });

  test('SCEN-2369: 顧客対応パターン分析結果が0件のとき、デフォルト値0.5が適用される', () => {
    // 準備: モック化されたAIRecommendationEngineスタブ
    const aiRecommendationEngineStub = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      evaluatePatternRelevance: jest.fn(),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    // ログ収集用のモック
    const systemLogMessages: string[] = [];
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation((message: string) => {
        systemLogMessages.push(message);
      });

    // テスト入力データ: 顧客対応パターン分析結果0件
    const customerInteractionAnalysisResult = {
      patterns: [],
      totalCount: 0,
      analysisDate: '2024-01-15T11:00:00Z',
    };

    // 実行
    const result = calculateInferenceAccuracyScore(
      customerInteractionAnalysisResult,
      aiRecommendationEngineStub,
      {
        defaultScore: 0.5,
      }
    );

    // 検証: 推論精度スコアがデフォルト値0.5を返却
    expect(result.accuracyScore).toBe(0.5);

    // 検証: デフォルト値適用メッセージがシステムログに記録される
    const defaultScoreAppliedLog = systemLogMessages.find((msg) =>
      /顧客対応パターン分析結果が0件のため、デフォルトスコア0\.5を適用/.test(msg)
    );
    expect(defaultScoreAppliedLog).toBeDefined();

    // 検証: 外部AI呼び出しが行われていない（evaluatePatternRelevanceが呼ばれない）
    expect(aiRecommendationEngineStub.evaluatePatternRelevance).not.toHaveBeenCalled();

    // 検証: findSimilarPatternsは呼び出されている（分析プロセスの一部として）
    expect(aiRecommendationEngineStub.findSimilarPatterns).toHaveBeenCalled();

    // 検証: 内部の推奨パターンマスタからデフォルト値が適用されていることを確認
    expect(result.source).toBe('internal_default_pattern_master');

    // クリーンアップ
    consoleLogSpy.mockRestore();
  });
});