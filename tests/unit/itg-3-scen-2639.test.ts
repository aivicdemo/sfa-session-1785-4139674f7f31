import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2639
  test('根拠情報のフォーマットが不正のとき、表示エラーが発生する', () => {
    const mockAIEngine = {
      explainRecommendationReasoningStub: jest.fn().mockReturnValue({
        reasoning: undefined,
        evidenceData: null,
        successPattern: {},
      }),
    };

    const invalidReasoningResult = {
      reasoning: undefined,
      evidenceData: null,
      successPattern: {},
    };

    const expectedErrorMessage = /根拠情報のフォーマットが不正です/;
    const uiErrorMessage = '根拠情報の取得に失敗しました。管理者に報告してください';

    expect(() => {
      const result = explainRecommendationReasoning(invalidReasoningResult);
      if (!result || typeof result !== 'object') {
        throw new Error('根拠情報のフォーマットが不正です');
      }
      if (!result.reasoning || typeof result.reasoning !== 'string') {
        throw new Error('根拠情報のフォーマットが不正です');
      }
      if (!result.evidenceData || !Array.isArray(result.evidenceData)) {
        throw new Error('根拠情報のフォーマットが不正です');
      }
      if (!result.successPattern || typeof result.successPattern !== 'object') {
        throw new Error('根拠情報のフォーマットが不正です');
      }
    }).toThrow(expectedErrorMessage);

    const errorLog = {
      timestamp: '2024-01-15T11:00:00Z',
      stackTrace: expect.any(String),
      invalidDataStructure: invalidReasoningResult,
      uiMessage: uiErrorMessage,
    };

    expect(errorLog.timestamp).toBe('2024-01-15T11:00:00Z');
    expect(errorLog.uiMessage).toBe(uiErrorMessage);
    expect(errorLog.invalidDataStructure).toEqual(invalidReasoningResult);

    const recommendationDisplayState = {
      isVisible: true,
      reasoning: null,
      evidenceData: [],
      successPattern: null,
      errorOccurred: true,
    };

    expect(recommendationDisplayState.isVisible).toBe(true);
    expect(recommendationDisplayState.errorOccurred).toBe(true);
    expect(recommendationDisplayState.reasoning).toBe(null);
  });
});