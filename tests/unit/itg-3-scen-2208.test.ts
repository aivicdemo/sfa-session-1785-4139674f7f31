import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2208
  test('顧客対応の接触パターンの分析 - 接触タイミングが成功パターンと同じとき、マッチスコアが100になる', () => {
    const successPattern = {
      patternId: 'success_pattern_001',
      customerIndustry: 'manufacturing',
      customerSize: 'large',
      followUpDaysAfterInitialContact: 7,
      proposalApproachType: 'consultative',
      averageContractValue: 5000000,
    };

    const customerContactTiming = {
      customerId: 'cust_12345',
      initialContactDate: new Date('2024-01-01T00:00:00Z'),
      lastFollowUpDate: new Date('2024-01-08T00:00:00Z'),
      daysSinceInitialContact: 7,
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        overallRelevanceScore: 95,
        timingMatchScore: 100,
        industryMatchScore: 90,
        sizeMatchScore: 85,
      }),
    };

    const result = evaluatePatternRelevance(
      successPattern,
      customerContactTiming,
      mockAIEngine
    );

    expect(result).toEqual({
      timingMatchScore: 100,
      isTimingPerfectMatch: true,
      message: '顧客対応の接触タイミングが成功パターンと完全に一致しています',
    });
  });
});