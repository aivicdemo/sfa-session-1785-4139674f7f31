import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('類似顧客マッチング処理 - 一致度100%のとき顧客が特定される', () => {
  test('SCEN-1594: 一致度が閾値ちょうど100%のとき、顧客が特定される', () => {
    // Arrange: テスト環境の準備
    const pastTransactionCustomerId = 'CUST-001';
    const pastTransactionIndustry = '製造業';
    const pastTransactionCompanySize = 'large';
    const pastTransactionPurchasePattern = 'quarterly';

    const newCaseCustomerId = 'CUST-NEW-001';
    const newCaseIndustry = '製造業';
    const newCaseCompanySize = 'large';
    const newCasePurchasePattern = 'quarterly';

    // AIRecommendationEngineのスタブ設定
    // evaluatePatternRelevanceメソッドが一致度スコア1.0（100%）を返す
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 1.0,
        matchingCustomerId: pastTransactionCustomerId,
        matchingStatus: 'Confirmed'
      })
    };

    const pastTransactionData = [
      {
        customerId: pastTransactionCustomerId,
        industry: pastTransactionIndustry,
        companySize: pastTransactionCompanySize,
        purchasePattern: pastTransactionPurchasePattern,
        successIndicator: true
      }
    ];

    const newCaseCondition = {
      customerId: newCaseCustomerId,
      industry: newCaseIndustry,
      companySize: newCaseCompanySize,
      purchasePattern: newCasePurchasePattern
    };

    // Act: マッチング処理を実行
    const matchingResult = findSimilarPatterns(
      newCaseCondition,
      pastTransactionData,
      mockAIEngine
    );

    // Assert: マッチング結果の検証
    // 一致度が100%（1.0）のとき、唯一の顧客が特定される
    expect(matchingResult.relevanceScore).toBe(1.0);
    
    // 特定された顧客IDが入力データの顧客IDと完全に一致
    expect(matchingResult.matchingCustomerId).toBe(pastTransactionCustomerId);
    
    // マッチング状態が「確定（Confirmed）」
    expect(matchingResult.matchingStatus).toBe('Confirmed');

    // AIエンジンの呼び出しが正しい引数で実行されたことを確認
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: newCaseCustomerId,
        industry: newCaseIndustry,
        companySize: newCaseCompanySize,
        purchasePattern: newCasePurchasePattern
      }),
      expect.any(Array)
    );
  });
});