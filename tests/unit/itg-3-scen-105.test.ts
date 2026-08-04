import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - OpenAI API呼び出しタイムアウト再試行', () => {
  test('SCEN-105: API呼び出しがタイムアウト（30秒超）した場合に再試行が最大3回実行される', async () => {
    const mockAIEngine = {
      callCount: 0,
      callTimestamps: [] as number[],
      generateRecommendation: jest.fn(async () => {
        mockAIEngine.callCount += 1;
        mockAIEngine.callTimestamps.push(Date.now());
        const error = new Error('API timeout exceeded 30 seconds');
        (error as any).code = 'TIMEOUT_EXCEEDED';
        throw error;
      }),
    };

    const inputCustomerData = {
      customerId: 'CUST-20240115-001',
      industry: 'Manufacturing',
      companySize: 'Large',
      currentPain: 'Supply chain optimization',
      budget: 5000000,
      decisionTimeline: '3 months',
    };

    const inputDealConditions = {
      dealId: 'DEAL-20240115-005',
      productCategory: 'Enterprise Platform',
      proposedValue: 2000000,
      competitorStatus: 'Active',
      customerEngagementLevel: 'High',
    };

    const startTime = Date.now();
    let result;

    try {
      result = await generateRecommendation(
        inputCustomerData,
        inputDealConditions,
        mockAIEngine as any
      );
    } catch (e) {
      // Expected to not throw after fallback handling
    }

    const endTime = Date.now();
    const totalDuration = endTime - startTime;

    // Verify API was called exactly 3 times
    expect(mockAIEngine.callCount).toBe(3);

    // Verify exponential backoff intervals
    // First call immediate, then ~1s wait, then ~2s wait
    expect(mockAIEngine.callTimestamps.length).toBe(3);

    const interval1 = mockAIEngine.callTimestamps[1] - mockAIEngine.callTimestamps[0];
    const interval2 = mockAIEngine.callTimestamps[2] - mockAIEngine.callTimestamps[1];

    // First retry should be approximately 1000ms (1 second)
    expect(interval1).toBeGreaterThanOrEqual(900);
    expect(interval1).toBeLessThanOrEqual(1200);

    // Second retry should be approximately 2000ms (2 seconds)
    expect(interval2).toBeGreaterThanOrEqual(1800);
    expect(interval2).toBeLessThanOrEqual(2400);

    // Verify fallback behavior: should return top success patterns from master data
    expect(result).toBeDefined();
    expect(result).toHaveProperty('recommendedApproach');
    expect(result).toHaveProperty('successPatterns');
    expect(result).toHaveProperty('rationale');
    expect(result).toHaveProperty('confidenceScore');

    // Verify fallback returns simplified explanation
    expect(result.rationale).toBeDefined();
    expect(typeof result.rationale).toBe('string');
    expect(result.rationale.length).toBeLessThan(500); // Simplified version

    // Verify confidence score is present but lower than typical
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(result.confidenceScore).toBeLessThanOrEqual(100);

    // Verify success patterns are returned from master data
    expect(Array.isArray(result.successPatterns)).toBe(true);
    expect(result.successPatterns.length).toBeGreaterThan(0);

    // Verify each pattern has required fields
    result.successPatterns.forEach((pattern: any) => {
      expect(pattern).toHaveProperty('patternId');
      expect(pattern).toHaveProperty('applicabilityScore');
      expect(pattern.applicabilityScore).toBeGreaterThanOrEqual(0);
      expect(pattern.applicabilityScore).toBeLessThanOrEqual(100);
    });

    // Verify total duration reflects the exponential backoff waits
    // Minimum expected: ~3 seconds (1s + 2s backoff)
    expect(totalDuration).toBeGreaterThanOrEqual(2700);
  });
});