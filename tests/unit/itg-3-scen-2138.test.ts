import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2138
  test('推奨根拠データが空オブジェクトのとき、ValidationErrorがスローされる', () => {
    const emptyReasoningData = {};
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockImplementation(() => {
        throw new Error('推奨根拠データが不正です。必須フィールド（patternId、matchScore、applicableConditions等）が空です');
      }),
    };

    expect(() => {
      explainRecommendationReasoning(emptyReasoningData, mockAIEngine);
    }).toThrow(/推奨根拠データ/);
  });
});