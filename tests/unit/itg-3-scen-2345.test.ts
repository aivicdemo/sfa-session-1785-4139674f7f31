import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { generateAndSaveReport } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - レポート生成・保存', () => {
  let mockAIEngine: any;
  let mockFileStorage: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };
  });

  // SCEN-2345
  test('推奨内容の必須フィールド欠落時、レポート生成が中断されuploadが呼び出されない', async () => {
    const incompleteRecommendation = {
      recommendationText: null,
      reasoningExplanation: 'この顧客は過去の成功パターンに高度に合致しています',
      patternScore: 85,
      similarPatterns: [
        {
          patternId: 'SP001',
          matchScore: 0.92,
          description: '同業種大規模企業への提案成功事例',
        },
      ],
      suggestedActions: ['初回ヒアリング日程調整', '経営層向け資料準備'],
      riskFactors: ['導入予算の制約'],
      nextSteps: '顧客との初回会議を来週実施',
      confidenceScore: 78,
    };

    mockAIEngine.generateRecommendation.mockResolvedValue(
      incompleteRecommendation
    );

    const dealContext = {
      customerId: 'CUST-12345',
      industryType: 'manufacturing',
      companySize: 'large',
      dealStage: 'initial_contact',
      purchaseHistory: [],
    };

    const result = await generateAndSaveReport(
      dealContext,
      mockAIEngine,
      mockFileStorage
    );

    expect(result).toEqual(
      expect.objectContaining({
        success: false,
        errorCode: 'DATA_MISSING_ERROR',
        errorMessage: expect.stringMatching(/推奨内容の必須データが不足/),
      })
    );

    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});