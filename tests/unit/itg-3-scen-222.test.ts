import { generateRecommendationWithDuplicateHandling } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-222
  test('顧客重複候補データが存在する顧客を新規案件の顧客として指定したとき、推奨処理がエラーになり、キャッシュ推奨が表示される', () => {
    // Arrange
    const duplicateCustomerId = 'CUST-DUP-001';
    const newDealInput = {
      customerId: duplicateCustomerId,
      productCategory: 'ソリューション営業',
      budgetRange: 'M',
      industryType: '製造業'
    };

    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(
        new Error('顧客の一意性検証エラー')
      ),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const cachedSuccessPatterns = [
      {
        patternId: 'PATTERN-001',
        customerId: 'CUST-SIM-001',
        productCategory: 'ソリューション営業',
        budgetRange: 'M',
        industryType: '製造業',
        proposalApproach: 'リスク軽減型提案',
        reasoningBrief: '同業種、同予算規模での成約事例'
      },
      {
        patternId: 'PATTERN-002',
        customerId: 'CUST-SIM-002',
        productCategory: 'ソリューション営業',
        budgetRange: 'M',
        industryType: '製造業',
        proposalApproach: 'ROI最大化型提案',
        reasoningBrief: '導入後3ヶ月で効果実現パターン'
      },
      {
        patternId: 'PATTERN-003',
        customerId: 'CUST-SIM-003',
        productCategory: 'ソリューション営業',
        budgetRange: 'M',
        industryType: '製造業',
        proposalApproach: 'プロセス改善型提案',
        reasoningBrief: '業務フロー改善による生産性向上事例'
      }
    ];

    const mockPatternRepository = {
      getTopSuccessPatterns: jest.fn().mockReturnValue(cachedSuccessPatterns)
    };

    // Act
    const result = generateRecommendationWithDuplicateHandling(
      newDealInput,
      mockRecommendationEngine,
      mockPatternRepository
    );

    // Assert
    expect(result.status).toBe('error_with_cache');
    expect(result.message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );
    expect(result.cachedRecommendations).toHaveLength(3);
    expect(result.cachedRecommendations[0]).toEqual({
      patternId: 'PATTERN-001',
      customerId: 'CUST-SIM-001',
      productCategory: 'ソリューション営業',
      budgetRange: 'M',
      industryType: '製造業',
      proposalApproach: 'リスク軽減型提案',
      reasoningBrief: '同業種、同予算規模での成約事例'
    });
    expect(result.cachedRecommendations[1]).toEqual({
      patternId: 'PATTERN-002',
      customerId: 'CUST-SIM-002',
      productCategory: 'ソリューション営業',
      budgetRange: 'M',
      industryType: '製造業',
      proposalApproach: 'ROI最大化型提案',
      reasoningBrief: '導入後3ヶ月で効果実現パターン'
    });
    expect(result.cachedRecommendations[2]).toEqual({
      patternId: 'PATTERN-003',
      customerId: 'CUST-SIM-003',
      productCategory: 'ソリューション営業',
      budgetRange: 'M',
      industryType: '製造業',
      proposalApproach: 'プロセス改善型提案',
      reasoningBrief: '業務フロー改善による生産性向上事例'
    });
    expect(result.errorLog).toMatch(/顧客重複候補が検出され/);
    expect(result.errorLog).toMatch(/AIRecommendationEngineの呼び出しが失敗した/);
  });
});