import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨機能 - 顧客条件欠落時の推奨判定', () => {
  // SCEN-154
  test('新規案件の顧客条件が欠落している場合、OpenAI API呼び出しを行わず内部パターンマスタから推奨を返却し警告フラグを付与する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const incompleteCustomerData = {
      customerId: 'CUST-20240115-001',
      customerName: '', // 顧客名が欠落
      industry: 'IT', // 業界は有
      budget: 5000000, // 予算は有
      dealAmount: 0,
      dealStage: 'initial_contact',
      companySize: 'medium',
      decisionMakerRole: 'CTO',
    };

    const result = generateRecommendation(
      incompleteCustomerData,
      mockAIEngine,
      mockFileStorage
    );

    // OpenAI API呼び出しが実行されないことを確認
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();

    // 代替動作: 内部推奨パターンマスタから統計的に上位パターンを返却
    expect(result.recommendationSource).toBe('internal_pattern_master');

    // 警告フラグが付与されていることを確認
    expect(result.hasIncompleteCondition).toBe(true);
    expect(result.warningMessage).toBe('顧客条件が不完全です');

    // 欠落している項目が記録されていることを確認
    expect(result.missingFields).toContain('customerName');

    // 返却されたパターンが統計的に上位のパターンであることを確認
    expect(result.recommendedApproach).toBeDefined();
    expect(result.recommendedApproach.pattern).toBeDefined();
    expect(result.recommendedApproach.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(result.recommendedApproach.confidenceScore).toBeLessThanOrEqual(100);

    // 根拠説明が簡略版で提供されることを確認
    expect(result.reasoning).toBeDefined();
    expect(result.reasoning.isSimplified).toBe(true);
    expect(result.reasoning.explanation).toMatch(/内部パターン/);

    // 簡略版の根拠説明は詳細な相関分析を含まないことを確認
    expect(result.reasoning.similarCases).toBeUndefined();
    expect(result.reasoning.detailedAnalysis).toBeUndefined();
  });
});