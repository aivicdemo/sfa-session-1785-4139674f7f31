import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// SCEN-1995
describe('AIエージェント推奨根拠の可視化機能 - 経営層向け説得資料生成エラーハンドリング', () => {
  it('照合評価が不適合の状態のとき、資料生成がエラーになる', async () => {
    // Import the logic function
    const { generateExecutivePersuasionMaterial } = await import(
      '../../src/logic/it-1-br-3-1-1-1'
    );

    // Setup: Create stub for AIRecommendationEngine that simulates compliance check failure
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        complianceStatus: 'INCOMPATIBLE',
        score: 0,
        reason: '照合評価が不適合'
      })
    };

    // Setup: Create stub for FileStorageAdapter
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn()
    };

    // Input data: Customer information with incompatible compliance status
    const inputProposal = {
      customerId: 'CUST-20240115-001',
      customerName: '株式会社テスト',
      industry: 'IT',
      businessChallenge: 'デジタル変革',
      proposedProduct: 'クラウドERPシステム',
      implementationEffects: '業務効率30%向上',
      complianceEvaluationStatus: 'INCOMPATIBLE',
      estimatedInvestment: 5000000,
      expectedROI: 12000000
    };

    // Execute: Call generateExecutivePersuasionMaterial with incompatible compliance status
    await expect(
      generateExecutivePersuasionMaterial(
        inputProposal,
        mockAIRecommendationEngine,
        mockFileStorageAdapter
      )
    ).rejects.toThrow(/照合評価/);

    // Verify: FileStorageAdapter upload was NOT called
    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();

    // Verify: Error should be caught and re-thrown with compliance-related message
    try {
      await generateExecutivePersuasionMaterial(
        inputProposal,
        mockAIRecommendationEngine,
        mockFileStorageAdapter
      );
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toMatch(/照合評価/);
    }
  });
});