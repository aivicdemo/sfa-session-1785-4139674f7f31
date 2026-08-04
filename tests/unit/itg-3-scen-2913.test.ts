import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('generateRecommendation with exponential backoff retry on API failure', () => {
  test('SCEN-2913: Retries 3 times with exponential backoff (1s, 2s, 4s) when OpenAI API fails, then falls back to pattern master', async () => {
    // Mock AIRecommendationEngine to track call times and failure
    const callTimestamps: number[] = [];
    let callCount = 0;

    const mockAIEngine = {
      generateRecommendation: jest.fn(async () => {
        callCount++;
        callTimestamps.push(Date.now());
        throw new Error('API connection failed');
      }),
    };

    // Mock FileStorageAdapter (not used in this test but required by function signature)
    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // Input parameters: new customer inquiry with company info
    const customerInput = {
      company_name: 'TechCorp Inc',
      industry: 'Software Development',
      budget_scale: 5000000,
      number_of_employees: 250,
      business_challenge: 'Digital transformation of legacy systems',
    };

    const dealConditions = {
      deal_stage: 'Initial Contact',
      target_product: 'Cloud Migration Service',
      deal_value_estimate: 3000000,
      decision_timeline_months: 6,
    };

    // Mock recommendation pattern master for fallback
    const mockRecommendationPatternMaster = [
      {
        pattern_id: 'PAT-001',
        success_rate: 0.82,
        customer_industry: 'Software Development',
        approach_name: 'Enterprise Transformation',
        approach_description: 'Phased cloud migration with legacy system modernization',
        recommended_actions: ['Stakeholder alignment', 'Technical assessment', 'Pilot project'],
      },
      {
        pattern_id: 'PAT-002',
        success_rate: 0.75,
        customer_industry: 'Software Development',
        approach_name: 'Quick Win Strategy',
        approach_description: 'Fast implementation of high-value modules',
        recommended_actions: ['Priority prioritization', 'Agile deployment'],
      },
    ];

    try {
      const result = await generateRecommendation(
        customerInput,
        dealConditions,
        mockAIEngine,
        mockFileStorage,
        mockRecommendationPatternMaster,
      );

      // Verify 3 retries were attempted
      expect(callCount).toBe(3);

      // Verify exponential backoff intervals
      // Expected intervals: 1000ms, 2000ms, 4000ms
      expect(callTimestamps.length).toBe(3);

      // Interval from call 1 to call 2 should be ~1000ms (+ small tolerance for execution)
      const interval_1_to_2 = callTimestamps[1] - callTimestamps[0];
      expect(interval_1_to_2).toBeGreaterThanOrEqual(900);
      expect(interval_1_to_2).toBeLessThanOrEqual(1200);

      // Interval from call 2 to call 3 should be ~2000ms
      const interval_2_to_3 = callTimestamps[2] - callTimestamps[1];
      expect(interval_2_to_3).toBeGreaterThanOrEqual(1900);
      expect(interval_2_to_3).toBeLessThanOrEqual(2200);

      // Verify fallback behavior: response includes top-ranked pattern
      expect(result).toBeDefined();
      expect(result.fallback_mode).toBe(true);
      expect(result.user_message).toMatch(/一時的な遅延/);
      expect(result.user_message).toMatch(/過去の推奨履歴/);

      // Verify top-ranked pattern from master is returned
      expect(result.recommended_approach.pattern_id).toBe('PAT-001');
      expect(result.recommended_approach.success_rate).toBe(0.82);
      expect(result.recommended_approach.approach_name).toBe('Enterprise Transformation');
      expect(result.recommended_approach.recommended_actions).toEqual([
        'Stakeholder alignment',
        'Technical assessment',
        'Pilot project',
      ]);

      // Verify no fourth attempt was made
      expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);
    } catch (error) {
      // Should not throw; fallback should handle gracefully
      fail('generateRecommendation should not throw after exhausting retries');
    }
  });
});