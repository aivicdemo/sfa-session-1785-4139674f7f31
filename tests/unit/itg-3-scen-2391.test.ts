import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('推論精度スコア算出機能 - 信頼度評価', () => {
  test('SCEN-2391: 基準参照データがnullのとき、エラーが発生する', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn(() => {
        throw new Error('ReferenceDataNotFound');
      }),
    };

    const recommendationData = {
      patternId: 'pattern_001',
      customerIndustry: 'Manufacturing',
      customerSize: 'Large',
      proposalContent: 'ERP導入提案',
      successRate: 0.85,
    };

    const referenceData = null;

    expect(() => {
      evaluatePatternRelevance(
        recommendationData,
        referenceData,
        mockAIEngine
      );
    }).toThrow(/ReferenceDataNotFound/);

    let thrownError: any;
    try {
      evaluatePatternRelevance(
        recommendationData,
        referenceData,
        mockAIEngine
      );
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeDefined();
    expect(thrownError.code).toBe('INVALID_REFERENCE_DATA');
    expect(thrownError.statusCode).toBe(400);
    expect(thrownError.message).toMatch(/基準参照データ|ReferenceDataNotFound/);
  });
});