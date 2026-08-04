import { determineSalesCoachingPolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 営業担当者指導方針決定機能', () => {
  test('SCEN-506: 指導方針の優先順位が重複しているときエラーが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'test approach',
        confidence: 85,
        reasoning: 'test reasoning'
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const duplicatePriorityPolicies = [
      {
        policyId: 'policy_001',
        title: '顧客ニーズ深掘り',
        priority: 1,
        description: 'Customer needs deep dive'
      },
      {
        policyId: 'policy_002',
        title: '提案資料カスタマイズ',
        priority: 2,
        description: 'Customize proposal materials'
      },
      {
        policyId: 'policy_003',
        title: '初回接触戦略',
        priority: 1,
        description: 'Initial contact strategy'
      }
    ];

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn()
    };

    expect(() => {
      determineSalesCoachingPolicy(
        duplicatePriorityPolicies,
        mockAIEngine,
        mockFileStorageAdapter
      );
    }).toThrow(/優先順位は一意である必要があります/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});