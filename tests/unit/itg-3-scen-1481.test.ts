import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 購買履歴データ品質判定', () => {
  // SCEN-1481: [error] 購買履歴データ品質判定機能 - 1件の購買履歴データで品質判定が実行される
  test('should evaluate data quality for single purchase history record with AI engine failure fallback', () => {
    const mockPurchaseHistory = {
      purchase_id: 'PH-2024-001',
      customer_id: 'CUST-12345',
      product_id: 'PROD-98765',
      purchase_date: '2024-01-15T10:30:00Z',
      amount: 150000,
      category: 'Software'
    };

    const mockAIEngineStub = {
      evaluatePatternRelevance: jest.fn().mockImplementation(() => {
        throw new Error('External AI service temporary failure');
      })
    };

    const mockRecommendationPatternMaster = [
      {
        pattern_id: 'PAT-001',
        success_rate: 0.92,
        applicable_segments: ['Software', 'Enterprise'],
        description: 'Enterprise Software - Quarterly Purchase Pattern'
      },
      {
        pattern_id: 'PAT-002',
        success_rate: 0.85,
        applicable_segments: ['Software'],
        description: 'Software - Annual Renewal Pattern'
      },
      {
        pattern_id: 'PAT-003',
        success_rate: 0.78,
        applicable_segments: ['Hardware', 'Software'],
        description: 'Mixed Category - Ad-hoc Purchase Pattern'
      }
    ];

    const result = evaluatePurchaseHistoryDataQuality(
      mockPurchaseHistory,
      mockAIEngineStub,
      mockRecommendationPatternMaster
    );

    expect(result).toBeDefined();
    expect(result.record_count).toBe(1);
    expect(result.quality_score).toBeGreaterThanOrEqual(0);
    expect(result.quality_score).toBeLessThanOrEqual(100);
    expect(result.missing_fields).toBeDefined();
    expect(Array.isArray(result.missing_fields)).toBe(true);
    expect(result.anomaly_detected).toBeDefined();
    expect(typeof result.anomaly_detected).toBe('boolean');
    
    expect(result.fallback_pattern_applied).toBe(true);
    expect(result.fallback_pattern).toBeDefined();
    expect(result.fallback_pattern.pattern_id).toBe('PAT-001');
    expect(result.fallback_pattern.success_rate).toBe(0.92);
    
    expect(result.error_log).toBeDefined();
    expect(result.error_log.error_occurred).toBe(true);
    expect(result.error_log.error_message).toMatch(/外部AIサービス|External AI/i);
    expect(result.error_log.timestamp).toBeDefined();
    expect(result.error_log.recovery_action).toBe('pattern_master_fallback');
  });
});