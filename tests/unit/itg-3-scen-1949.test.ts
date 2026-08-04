import { displayRecommendationReasoningWhenS3UploadFails } from '../../src/logic/it-1-br-3-2-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1949
  test('推奨内容の根拠表示機能 - S3ファイルアップロード失敗時にHTML形式の根拠が画面表示される', () => {
    fetchMock.resetMocks();

    const customerConditions = {
      industry: '大手製造業',
      budget: 50000000,
      implementationPeriod: 3,
    };

    const recommendationContent = {
      approach: '段階的導入アプローチ',
      reasoning: '過去の類似案件では3ヶ月導入期間で段階的導入により成功率95%を達成',
      referenceExamples: '同業他社での段階的導入事例を参考',
    };

    const fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn().mockRejectedValue(
        new Error('NetworkError'),
      ),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approach: recommendationContent.approach,
        reasoning: recommendationContent.reasoning,
        referenceExamples: recommendationContent.referenceExamples,
        confidenceScore: 95,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = displayRecommendationReasoningWhenS3UploadFails(
      customerConditions,
      fileStorageAdapterStub,
      aiRecommendationEngineStub,
    );

    expect(result).toEqual({
      displayFormat: 'HTML',
      content: expect.stringContaining(recommendationContent.approach),
      includesReasoning: expect.stringContaining(
        recommendationContent.reasoning,
      ),
      includesReferences: expect.stringContaining(
        recommendationContent.referenceExamples,
      ),
      isBrowserSaveable: true,
      hasS3ErrorMessage: false,
    });

    expect(result.content).toContain('段階的導入アプローチ');
    expect(result.content).toContain(
      '過去の類似案件では3ヶ月導入期間で段階的導入により成功率95%を達成',
    );
    expect(result.content).toContain('同業他社での段階的導入事例を参考');
    expect(result.isBrowserSaveable).toBe(true);
    expect(result.hasS3ErrorMessage).toBe(false);

    expect(fileStorageAdapterStub.uploadRecommendationReport).toHaveBeenCalled();
    expect(aiRecommendationEngineStub.generateRecommendation).toHaveBeenCalled();
  });
});