import { evaluateDataQualityScore } from '../../src/logic/itg-3';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推奨支援システム - データ品質スコア算出', () => {
  test('SCEN-475: [error] データ品質スコア算出機能 - 検証結果レポートが null のとき、エラーが発生する', () => {
    fetchMock.resetMocks();

    const nullValidationReport = null;
    const timestamp = '2024-01-15T11:00:00Z';
    const errorCode = 'DATA_QUALITY_001';
    const inputParams = {
      validationReport: nullValidationReport,
      timestamp: timestamp,
    };

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn((report) => {
        if (report === null) {
          const error = new Error('検証結果レポートがnullです');
          (error as any).name = 'ValidationReportNullError';
          (error as any).code = errorCode;
          (error as any).timestamp = timestamp;
          (error as any).inputParams = inputParams;
          throw error;
        }
        return { score: 85 };
      }),
    };

    expect(() => {
      evaluateDataQualityScore(nullValidationReport, mockAIRecommendationEngine);
    }).toThrow(/検証結果レポートがnullです/);

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      nullValidationReport
    );
  });
});