import { validateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('顧客データ完全性・妥当性判定機能', () => {
  // SCEN-712
  test('同じ顧客情報で判定処理を2回実行したとき、両回ともに同じ判定結果が返却される', () => {
    // テスト用の顧客データを準備
    const customerData = {
      customerId: 'CUST-001',
      industry: 'manufacturing',
      companySize: 'large',
      pastPurchaseAmount: 5000000,
      dealStage: 'proposal',
      contactHistory: 12,
      lastContactDate: '2024-01-15T10:00:00Z',
      needsDescription: '業務効率化を目指した販売支援システム導入',
      decisionMaker: 'executive',
      budget: 3000000,
    };

    // AIRecommendationEngineのスタブを初期化
    const aiEngineStub = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendedApproach: 'direct_executive_proposal',
        confidenceScore: 78,
        reasoningExplanation: '過去の成功パターンとの一致度が高く、経営層への直接提案が有効',
        applicableSuccessPatternIds: ['PATTERN-001', 'PATTERN-005'],
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'PATTERN-001',
          matchingDegree: 0.85,
          exampleCompany: 'Company A',
        },
      ]),
    };

    // 第1回目の判定処理を実行
    const firstResult = validateCustomerDataCompleteness(
      customerData,
      aiEngineStub
    );

    // 第1回目の判定結果（タイムスタンプとトランザクションIDを除く）を記録
    const firstResultWithoutTransientFields = {
      isComplete: firstResult.isComplete,
      isValid: firstResult.isValid,
      recommendedApproach: firstResult.recommendedApproach,
      confidenceScore: firstResult.confidenceScore,
      reasoningExplanation: firstResult.reasoningExplanation,
      applicableSuccessPatternIds: firstResult.applicableSuccessPatternIds,
      canGenerateRecommendation: firstResult.canGenerateRecommendation,
    };

    // 第2回目の判定処理を実行（同一の顧客データを入力）
    const secondResult = validateCustomerDataCompleteness(
      customerData,
      aiEngineStub
    );

    // 第2回目の判定結果（タイムスタンプとトランザクションIDを除く）を記録
    const secondResultWithoutTransientFields = {
      isComplete: secondResult.isComplete,
      isValid: secondResult.isValid,
      recommendedApproach: secondResult.recommendedApproach,
      confidenceScore: secondResult.confidenceScore,
      reasoningExplanation: secondResult.reasoningExplanation,
      applicableSuccessPatternIds: secondResult.applicableSuccessPatternIds,
      canGenerateRecommendation: secondResult.canGenerateRecommendation,
    };

    // 第1回目と第2回目の判定結果を比較
    expect(firstResultWithoutTransientFields).toEqual(
      secondResultWithoutTransientFields
    );

    // 推奨提案内容が完全に一致することを確認
    expect(firstResult.recommendedApproach).toBe('direct_executive_proposal');
    expect(secondResult.recommendedApproach).toBe('direct_executive_proposal');

    // 評価スコアが完全に一致することを確認
    expect(firstResult.confidenceScore).toBe(78);
    expect(secondResult.confidenceScore).toBe(78);

    // 推奨根拠説明が完全に一致することを確認
    expect(firstResult.reasoningExplanation).toBe(
      '過去の成功パターンとの一致度が高く、経営層への直接提案が有効'
    );
    expect(secondResult.reasoningExplanation).toBe(
      '過去の成功パターンとの一致度が高く、経営層への直接提案が有効'
    );

    // 妥当性判定フラグが完全に一致することを確認
    expect(firstResult.isComplete).toBe(secondResult.isComplete);
    expect(firstResult.isValid).toBe(secondResult.isValid);

    // 適用可能な成功パターンIDが完全に一致することを確認
    expect(firstResult.applicableSuccessPatternIds).toEqual(
      secondResult.applicableSuccessPatternIds
    );
    expect(firstResult.applicableSuccessPatternIds).toEqual([
      'PATTERN-001',
      'PATTERN-005',
    ]);

    // 推奨生成可能判定フラグが完全に一致することを確認
    expect(firstResult.canGenerateRecommendation).toBe(
      secondResult.canGenerateRecommendation
    );
  });
});