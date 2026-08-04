import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateExecutivePersuasionMaterial } from '../../src/logic/it-1-br-3-1-1-1';

describe('経営層向け説得資料の自動生成機能', () => {
  // SCEN-2010
  test('照合評価の実施日時がnullのとき、資料生成がエラーになる', () => {
    const customerInfo = {
      name: 'テスト顧客A',
      industry: '製造業',
      challenge: '生産効率化',
    };

    const proposalContent = {
      summary: 'AI導入による自動化',
      estimatedAmount: 5000000,
    };

    const evaluationResult = {
      evaluationDateTime: null,
      compatibilityScore: 85,
      riskFactors: [],
      improvementSuggestions: [],
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'Phase-wise AI implementation',
        confidenceScore: 88,
        rationale: 'Based on similar manufacturing cases',
      }),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileUrl: 'https://s3.example.com/report.pdf',
        expiresIn: 3600,
      }),
    };

    expect(() =>
      generateExecutivePersuasionMaterial(
        customerInfo,
        proposalContent,
        evaluationResult,
        mockAIRecommendationEngine,
        mockFileStorageAdapter
      )
    ).toThrow(/実施日時/);

    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});