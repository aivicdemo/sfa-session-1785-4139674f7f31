import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化 - 推奨スコア算出機能', () => {
  let mockAIRecommendationEngine: any;
  let mockFileStorageAdapter: any;

  beforeEach(() => {
    mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockReturnValue(''),
      evaluatePatternRelevance: jest.fn(),
    };

    mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };
  });

  // SCEN-1666
  test('explainRecommendationReasoningが空文字列を返却した場合、推奨スコア算出機能はエラーを発生させ、代替推奨パターンを取得して返却すること', async () => {
    const customerData = {
      customerId: 'CUST-2024-001',
      customerName: '株式会社テスト販売',
      industry: '製造業',
      scale: '中堅企業',
      employeeCount: 250,
      annualRevenue: 5000000000,
      contactHistory: 15,
      lastContactDate: '2024-11-15T10:30:00Z',
    };

    const dealConditions = {
      dealId: 'DEAL-2024-500',
      stage: '提案段階',
      value: 3000000,
      expectedClosingDate: '2024-12-31T23:59:59Z',
      competitorCount: 2,
      customerNeedType: '業務効率化',
      decisionMakerRole: '経営層',
    };

    const recommendationContent = {
      recommendationId: 'REC-2024-100',
      proposalApproach: 'デジタル変革提案',
      suggestedNextAction: 'CTO面談設定',
      riskFactors: ['予算承認遅延'],
      successProbability: 0.78,
      timeline: '2024-12-15T14:00:00Z',
    };

    const fallbackRecommendationPattern = {
      patternId: 'PATTERN-FALLBACK-001',
      patternName: '標準成功パターン：製造業_中堅_業務効率化',
      proposalApproach: '段階的デジタル導入',
      suggestedNextAction: '経営層向けワークショップ開催',
      historicalSuccessRate: 0.72,
      appliedCaseCount: 87,
      description: '過去の推奨履歴から取得した類似案件の成功パターン',
    };

    mockAIRecommendationEngine.explainRecommendationReasoning.mockReturnValue('');

    mockFileStorageAdapter.uploadRecommendationReport.mockResolvedValue({
      reportId: 'REPORT-2024-001',
      s3Url: 'https://s3.amazonaws.com/ai-recommendations/report-2024-001.pdf',
      expiresAt: '2024-12-10T08:00:00Z',
    });

    const result = await calculateRecommendationScore(
      customerData,
      dealConditions,
      recommendationContent,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    expect(result).toEqual({
      status: 'error_with_fallback',
      errorMessage: '推奨根拠の説明生成に失敗しました',
      userMessage: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      fallbackRecommendation: {
        patternId: 'PATTERN-FALLBACK-001',
        patternName: '標準成功パターン：製造業_中堅_業務効率化',
        proposalApproach: '段階的デジタル導入',
        suggestedNextAction: '経営層向けワークショップ開催',
        historicalSuccessRate: 0.72,
        appliedCaseCount: 87,
        description: '過去の推奨履歴から取得した類似案件の成功パターン',
      },
      reportUrl: 'https://s3.amazonaws.com/ai-recommendations/report-2024-001.pdf',
      reportExpiresAt: '2024-12-10T08:00:00Z',
    });

    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      customerData,
      dealConditions,
      recommendationContent
    );
  });
});