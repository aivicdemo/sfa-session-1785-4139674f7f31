import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合・推奨機能', () => {
  // SCEN-1874
  test('過去商談データが空配列のとき成功パターン抽出に失敗する', () => {
    const emptyHistoricalData: any[] = [];
    
    const newDealCondition = {
      customerName: '株式会社テスト',
      dealAmount: 5000000,
      industry: '製造業',
      companySize: '従業員500名',
      dealStage: '提案準備段階'
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue({
        error: true,
        errorCode: 'INSUFFICIENT_HISTORICAL_DATA',
        errorMessage: '過去商談データが不足しているため成功パターンを抽出できません'
      }),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const mockFallbackPatterns = [
      {
        patternId: 'FBP001',
        successRate: 0.85,
        applicableIndustries: ['製造業', '流通業'],
        recommendedApproach: '経営課題ヒアリング → ROI提示 → 複数提案'
      },
      {
        patternId: 'FBP002',
        successRate: 0.78,
        applicableIndustries: ['製造業', 'IT'],
        recommendedApproach: '現状分析 → 効果測定指標設定 → 段階導入'
      }
    ];

    const result = findSimilarPatterns(
      emptyHistoricalData,
      newDealCondition,
      mockAIEngine,
      mockFallbackPatterns
    );

    expect(result.error).toBe(true);
    expect(result.errorCode).toBe('INSUFFICIENT_HISTORICAL_DATA');
    expect(result.errorMessage).toMatch(/過去商談データが不足しているため成功パターンを抽出できません/);
    expect(result.fallbackPatterns).toEqual([
      {
        patternId: 'FBP001',
        successRate: 0.85,
        applicableIndustries: ['製造業', '流通業'],
        recommendedApproach: '経営課題ヒアリング → ROI提示 → 複数提案'
      },
      {
        patternId: 'FBP002',
        successRate: 0.78,
        applicableIndustries: ['製造業', 'IT'],
        recommendedApproach: '現状分析 → 効果測定指標設定 → 段階導入'
      }
    ]);
    expect(result.loggingExecuted).toBe(true);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(emptyHistoricalData, newDealCondition);
  });
});