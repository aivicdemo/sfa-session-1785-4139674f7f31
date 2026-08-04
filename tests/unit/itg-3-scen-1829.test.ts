import { generateRecommendationWithEvidence } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠情報統合機能', () => {
  // SCEN-1829
  test('推奨根拠情報の統合機能 - 根拠情報に顧客IDが正確に記録される', async () => {
    const customer_id = 'CUST-20250801-001';
    const business_industry = 'IT';
    const budget_amount = '500万円';
    const purchase_stage = '提案段階';

    const deal_condition = {
      industry: business_industry,
      budget: budget_amount,
      purchase_phase: purchase_stage,
    };

    const ai_engine_stub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_content: '提案資料テンプレート_IT_500万円向け',
        reasoning_basis: {
          customer_id: customer_id,
          matched_success_patterns: ['pattern_001', 'pattern_002'],
          reasoning_factors: [
            'IT業界での過去成功案件3件の事例マッチング',
            '予算規模500万円が想定ROI範囲内',
            '提案段階での初期接触が最適タイミング',
          ],
          confidence_score: 87,
          generated_at: '2025-08-01T09:30:00Z',
        },
      }),
    };

    const result = await generateRecommendationWithEvidence(
      customer_id,
      deal_condition,
      ai_engine_stub
    );

    expect(result.reasoning_basis.customer_id).toBe(customer_id);
    expect(result.reasoning_basis.customer_id).not.toBeNull();
    expect(result.reasoning_basis.customer_id).not.toBeUndefined();
    expect(result.reasoning_basis.customer_id.length).toBeGreaterThan(0);

    const persisted_records = result.persisted_evidence_records;
    expect(persisted_records).toBeDefined();
    expect(Array.isArray(persisted_records)).toBe(true);
    expect(persisted_records.length).toBe(1);

    const first_record = persisted_records[0];
    expect(first_record.customer_id).toBe(customer_id);
    expect(first_record.customer_id).toEqual('CUST-20250801-001');

    expect(ai_engine_stub.generateRecommendation).toHaveBeenCalledWith(
      customer_id,
      deal_condition
    );

    expect(result.reasoning_basis.matched_success_patterns).toBeDefined();
    expect(Array.isArray(result.reasoning_basis.matched_success_patterns)).toBe(
      true
    );
    expect(result.reasoning_basis.matched_success_patterns.length).toBeGreaterThanOrEqual(
      1
    );

    expect(result.reasoning_basis.reasoning_factors).toBeDefined();
    expect(Array.isArray(result.reasoning_basis.reasoning_factors)).toBe(true);
    expect(result.reasoning_basis.reasoning_factors.length).toBeGreaterThanOrEqual(
      1
    );

    expect(result.reasoning_basis.confidence_score).toBe(87);
    expect(result.reasoning_basis.confidence_score).toBeGreaterThanOrEqual(0);
    expect(result.reasoning_basis.confidence_score).toBeLessThanOrEqual(100);

    expect(result.recommendation_content).toBeDefined();
    expect(result.recommendation_content.length).toBeGreaterThan(0);
  });
});