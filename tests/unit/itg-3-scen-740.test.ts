import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し新規案件に適用するための推奨生成機能', () => {
  test('SCEN-740: 新規顧客の購入制約条件と抽出した成功パターンが矛盾したとき推奨生成不可と判定される', () => {
    // Arrange: 新規顧客の購入制約条件を設定
    const newCustomerConstraints = {
      budget_max_yen: 1000000,
      implementation_period_months_max: 6,
      environment_type: 'on_premise'
    };

    // 抽出した過去成功パターンデータ
    const extracted_patterns = [
      {
        pattern_id: 'PATTERN_A',
        required_budget_yen: 2000000,
        required_implementation_months: 12,
        environment_type: 'cloud'
      },
      {
        pattern_id: 'PATTERN_B',
        required_budget_yen: 1500000,
        required_implementation_months: 9,
        environment_type: 'hybrid'
      }
    ];

    // AIRecommendationEngineのスタブを作成
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn((pattern) => {
        // 矛盾スコア（relevanceScore）を0.2以下で返却：制約条件との矛盾度が高い状態
        return {
          relevance_score: 0.15,
          is_applicable: false,
          contradiction_reasons: [
            '予算要件が矛盾: 必要額がカスタマー予算上限を超過',
            '導入期間が矛盾: 必要期間がカスタマー制約を超過',
            '環境タイプが矛盾: パターン環境がカスタマー環境と非互換'
          ]
        };
      })
    };

    // FileStorageAdapterのスタブを作成
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn()
    };

    // Act: evaluatePatternRelevanceメソッドを呼び出し
    const result = evaluatePatternRelevance(
      newCustomerConstraints,
      extracted_patterns,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    // Assert: 推奨生成が実行されず、エラー状態として判定されることを確認
    expect(result.recommendation_status).toBe('RECOMMENDATION_IMPOSSIBLE');
    expect(result.error_reason).toBe(
      '抽出した成功パターンが顧客の購入制約条件と矛盾しています'
    );
    expect(result.recommendation_record_created).toBe(false);
    expect(result.relevance_score).toBe(0.15);

    // AIRecommendationEngineのgenerateRecommendationメソッドが呼び出されないことを確認
    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();

    // FileStorageAdapterのuploadRecommendationReportメソッドが呼び出されないことを確認
    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();

    // evaluatePatternRelevanceメソッドが呼び出されたことを確認
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});