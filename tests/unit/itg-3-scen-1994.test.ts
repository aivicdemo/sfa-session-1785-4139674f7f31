import { generateExecutivePresentationMaterial } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 経営層向け説得資料自動生成', () => {
  test('SCEN-1994: 改善提案情報が未設定（null）のとき、資料生成がエラーになる', () => {
    const customerInfo = {
      customerId: 'CUST-001',
      companyName: 'サンプル企業',
      industry: 'IT',
      employeeCount: 150,
    };

    const dealCondition = {
      dealId: 'DEAL-001',
      dealStatus: 'proposal',
      expectedCloseDate: '2024-02-15',
      dealAmount: 5000000,
    };

    const proposalInfo = null;

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'アプローチA',
        proposalInfo: proposalInfo,
        confidenceScore: 85,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    expect(() => {
      generateExecutivePresentationMaterial(
        customerInfo,
        dealCondition,
        aiRecommendationEngineStub,
        fileStorageAdapterStub
      );
    }).toThrow(/改善提案情報/);

    try {
      generateExecutivePresentationMaterial(
        customerInfo,
        dealCondition,
        aiRecommendationEngineStub,
        fileStorageAdapterStub
      );
    } catch (error: any) {
      expect(error.errorType).toBe('ValidationError');
      expect(error.message).toContain('改善提案情報が設定されていません。資料生成を中止します');
      expect(error.errorCode).toBe('PROPOSAL_INFO_REQUIRED');
      expect(error.statusCode).toBe(400);
    }

    expect(fileStorageAdapterStub.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});