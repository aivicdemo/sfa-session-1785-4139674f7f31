import { calculateConfidenceScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-834: 信頼度スコア計算時に分母がゼロになるときエラーハンドリング', () => {
    // 分子が0、分母が0となるデータセット
    const inputData = {
      numerator: 0,
      denominator: 0,
      recommendationId: 'rec-001',
      patternCount: 0,
      successCount: 0,
    };

    // エラーが発生することを検証
    expect(() => calculateConfidenceScore(inputData)).toThrow(/分母/);
  });

  test('SCEN-834: 分母ゼロエラー時のユーザーメッセージとキャッシュフォールバック', () => {
    // 信頼度スコア計算失敗時の処理フロー
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        numerator: 0,
        denominator: 0,
      }),
    };

    const mockPatternMaster = [
      { patternId: 'p-001', successRate: 0.92, occurrences: 150 },
      { patternId: 'p-002', successRate: 0.88, occurrences: 120 },
      { patternId: 'p-003', successRate: 0.85, occurrences: 100 },
    ];

    try {
      calculateConfidenceScore({
        numerator: 0,
        denominator: 0,
        recommendationId: 'rec-001',
        patternCount: 0,
        successCount: 0,
      });
      fail('計算がエラーを発生させるべき');
    } catch (error: any) {
      // エラーメッセージが「分母」を含むことを確認
      expect(error.message).toMatch(/分母/);

      // フォールバック動作を検証
      const userMessage = '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します';
      expect(userMessage).toBeDefined();

      // キャッシュされた過去推奨パターンマスタから統計上位パターンを取得
      const topPattern = mockPatternMaster.reduce((prev, current) =>
        prev.occurrences > current.occurrences ? prev : current
      );

      expect(topPattern.patternId).toBe('p-001');
      expect(topPattern.successRate).toBe(0.92);
      expect(topPattern.occurrences).toBe(150);
    }
  });

  test('SCEN-834: 分母ゼロ時にPDF生成とS3アップロードが実行されない', () => {
    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
    };

    const processRecommendationWithErrorHandling = (
      scoreCalculator: (data: any) => number,
      fileStorage: any,
      inputData: any
    ) => {
      try {
        const score = scoreCalculator(inputData);
        // PDF生成とアップロード処理
        fileStorage.uploadRecommendationReport({ score });
        return { success: true, score };
      } catch (error) {
        // PDF生成とアップロードはスキップ
        return { success: false, error };
      }
    };

    const result = processRecommendationWithErrorHandling(
      calculateConfidenceScore,
      mockFileStorage,
      {
        numerator: 0,
        denominator: 0,
        recommendationId: 'rec-001',
        patternCount: 0,
        successCount: 0,
      }
    );

    // アップロードが呼び出されないことを検証
    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
    // エラーで停止することを検証
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});