import { validateLearningDataAndExecuteRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨支援システム - 学習データ品質検証と推論実行制御', () => {
  // SCEN-029: [normal] 学習データ量・品質検証機能 - 学習データ品質スコアが良好閾値未満の場合に推論実行が保留される
  test('学習データ品質スコアが閾値未満の場合、推論実行を保留し代替パターンを返す', () => {
    // Arrange: テストデータの準備
    const goodQualityThreshold = 0.7;
    const actualQualityScore = 0.4; // 閾値未満

    const newCaseData = {
      customerId: 'CUST-001',
      customerIndustry: 'manufacturing',
      customerSize: 'medium',
      dealAmount: 5000000,
      dealStage: 'proposal',
      salesRepId: 'REP-001',
    };

    // AIRecommendationEngine のスタブ（呼び出されてはいけない）
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 学習データ品質評価のスタブ（品質不良を返す）
    const mockQualityEvaluator = {
      evaluateQualityScore: jest.fn().mockReturnValue(actualQualityScore),
    };

    // 推奨パターンマスタの代替データ（内部キャッシュ）
    const cachedSuccessPatterns = [
      {
        patternId: 'PATTERN-TOP-001',
        industry: 'manufacturing',
        approachType: 'consultative_selling',
        adoptionRate: 0.78,
        estimatedDealSize: 'medium',
      },
      {
        patternId: 'PATTERN-TOP-002',
        industry: 'manufacturing',
        approachType: 'solution_selling',
        adoptionRate: 0.72,
        estimatedDealSize: 'medium',
      },
    ];

    // Act: 学習データ品質検証と推論実行制御を実行
    const result = validateLearningDataAndExecuteRecommendation({
      newCaseData,
      qualityThreshold: goodQualityThreshold,
      qualityEvaluator: mockQualityEvaluator,
      aiEngine: mockAIEngine,
      cachedPatterns: cachedSuccessPatterns,
    });

    // Assert: 期待される振る舞いを検証
    // 1. AIEngine のメソッドが一度も呼び出されていないこと
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();

    // 2. 学習データ品質評価が呼び出されていること
    expect(mockQualityEvaluator.evaluateQualityScore).toHaveBeenCalledWith(newCaseData);

    // 3. 推論実行が保留されていること
    expect(result.executionStatus).toBe('held');

    // 4. 推奨内容が代替パターン（キャッシュ）から取得されていること
    expect(result.recommendation).toBeDefined();
    expect(result.recommendation.patternId).toBe('PATTERN-TOP-001');
    expect(result.recommendation.adoptionRate).toBe(0.78);

    // 5. ユーザー向けメッセージが正しく設定されていること
    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    // 6. 品質スコアが記録されていること
    expect(result.qualityScore).toBe(0.4);

    // 7. 品質スコアが閾値未満であることが状態に反映されていること
    expect(result.qualityStatus).toBe('below_threshold');
  });
});