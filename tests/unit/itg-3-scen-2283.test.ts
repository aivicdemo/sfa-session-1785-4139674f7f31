import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

// Mock the external services
const mockAIRecommendationEngine = {
  generateRecommendation: jest.fn(),
  findSimilarPatterns: jest.fn(),
  explainRecommendationReasoning: jest.fn(),
  evaluatePatternRelevance: jest.fn(),
};

const mockFileStorageAdapter = {
  uploadRecommendationReport: jest.fn(),
  generateDownloadUrl: jest.fn(),
  deleteExpiredReports: jest.fn(),
};

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2283
  test('推奨内容が空のとき、PDFレポート生成がエラーになる', () => {
    // Arrange: AIRecommendationEngineが空の推奨内容を返すように設定
    const emptyRecommendationResult = {
      recommendation: '',
      reasoning: '根拠説明',
      patterns: [],
    };

    mockAIRecommendationEngine.generateRecommendation.mockResolvedValue(
      emptyRecommendationResult
    );

    // 外部サービスアダプタをspy対象に設定
    const uploadSpy = jest.spyOn(mockFileStorageAdapter, 'uploadRecommendationReport');

    // 入力パラメータ: 推奨レポート生成に必要な顧客・商談情報
    const reportInput = {
      customerId: 'CUST-001',
      dealId: 'DEAL-001',
      customerName: '日本テクノロジー株式会社',
      industry: '製造業',
      dealStage: '提案',
      recommendationEngine: mockAIRecommendationEngine,
      fileStorageAdapter: mockFileStorageAdapter,
    };

    // Act & Assert: エラーがスローされることを検証
    expect(() => generateRecommendationReport(reportInput)).toThrow(/推奨内容が空/);

    // uploadRecommendationReportが呼び出されていないことを検証
    expect(uploadSpy).not.toHaveBeenCalled();
  });
});