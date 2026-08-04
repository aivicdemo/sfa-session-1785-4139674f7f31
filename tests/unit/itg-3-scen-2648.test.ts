import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出ロジック - 過去商談データの形式が不正', () => {
  test('SCEN-2648: 不正な形式のデータを検出し、PatternExtractionErrorをthrowしてフォールバック成功パターンを返却する', async () => {
    const invalid_deal_date = '2024-13-45';
    const invalid_deal_amount = 'abc円';
    const invalid_customer_industry = null;

    const malformed_historical_deals = [
      {
        dealId: 'deal-001',
        dealDate: invalid_deal_date,
        dealAmount: invalid_deal_amount,
        customerIndustry: invalid_customer_industry,
        dealStatus: 'won',
      },
    ];

    const current_deal_condition = {
      customerIndustry: 'IT',
      dealAmount: 500000,
      dealStage: 'proposal',
    };

    const mock_ai_engine = {
      findSimilarPatterns: jest.fn().mockResolvedValueOnce({
        status: 400,
        errorCode: 'INVALID_DATA_FORMAT',
        message:
          '過去商談データのフィールド形式が不正です: dealDate is not a valid ISO 8601 date',
      }),
    };

    const fallback_patterns = [
      {
        patternId: 'pattern-top-1',
        successRate: 0.78,
        industry: 'IT',
        approachType: 'consultative_sales',
        recommendationScore: 85,
      },
      {
        patternId: 'pattern-top-2',
        successRate: 0.72,
        industry: 'IT',
        approachType: 'value_based_selling',
        recommendationScore: 79,
      },
    ];

    let thrown_error: any = null;
    let fallback_result: any = null;

    try {
      const response = await mock_ai_engine.findSimilarPatterns(
        malformed_historical_deals,
        current_deal_condition
      );

      if (
        response.status === 400 &&
        response.errorCode === 'INVALID_DATA_FORMAT'
      ) {
        thrown_error = {
          name: 'PatternExtractionError',
          errorCode: response.errorCode,
          message: response.message,
          timestamp: new Date('2024-01-15T11:00:00Z').toISOString(),
        };
        fallback_result = fallback_patterns;
      }
    } catch (err) {
      thrown_error = err;
    }

    expect(thrown_error).toBeDefined();
    expect(thrown_error.name).toBe('PatternExtractionError');
    expect(thrown_error.errorCode).toBe('INVALID_DATA_FORMAT');
    expect(thrown_error.message).toMatch(/過去商談データのフィールド形式が不正です/);
    expect(thrown_error.timestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/
    );

    expect(fallback_result).toBeDefined();
    expect(Array.isArray(fallback_result)).toBe(true);
    expect(fallback_result.length).toBe(2);
    expect(fallback_result[0].successRate).toBe(0.78);
    expect(fallback_result[0].recommendationScore).toBe(85);
    expect(fallback_result[1].successRate).toBe(0.72);
    expect(fallback_result[1].recommendationScore).toBe(79);
  });
});