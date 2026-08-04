import { generatePersuasionMaterial } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨支援システム - 経営層向け説得資料生成', () => {
  test('SCEN-1990: 照合評価結果が未設定のとき資料生成がエラーになる', () => {
    const customerInfo = {
      customerId: 'CUST-001',
      customerName: '株式会社テスト',
      industry: '製造業',
      scale: '中堅企業',
      businessGoal: '生産効率化',
      budget: 5000000,
      timeline: '2026-Q2'
    };

    const proposalContent = {
      proposalId: 'PROP-001',
      productCategory: 'システム導入',
      description: 'ERP システム',
      estimatedValue: 3500000,
      implementationPeriod: 6
    };

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'フェーズ導入',
        reasoning: '段階的な導入が有効'
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          caseId: 'CASE-101',
          similarity: 0.87,
          outcome: 'success'
        }
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        '過去の類似案件では段階的導入により採用率が向上しています'
      ),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(null)
    };

    const fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn()
    };

    expect(() =>
      generatePersuasionMaterial(
        customerInfo,
        proposalContent,
        aiRecommendationEngineStub,
        fileStorageAdapterStub
      )
    ).toThrow(/照合評価結果/);
  });
});