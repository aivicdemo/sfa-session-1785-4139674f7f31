import { generateAndSaveReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-988
  test('出力形式が未指定のとき、レポート生成処理が開始されず警告が返される', async () => {
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

    const customerId = 'CUST-001';
    const dealConditions = {
      industry: 'IT',
      budgetRange: '1000万円以上',
    };
    const outputFormat = null;

    const fixedTimestamp = '2026-05-26T10:30:00Z';
    jest.spyOn(global, 'Date').mockImplementation(() => ({
      toISOString: () => fixedTimestamp,
    } as any));

    const result = await generateAndSaveReport(
      customerId,
      dealConditions,
      outputFormat,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('INVALID_OUTPUT_FORMAT');
    expect(result.message).toBe(
      '出力形式が指定されていません。PDF または Excel を選択してください。'
    );
    expect(result.recommendationId).toBe(null);
    expect(result.downloadUrl).toBe(null);
    expect(result.timestamp).toBe(fixedTimestamp);

    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });
});