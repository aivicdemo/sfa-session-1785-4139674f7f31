import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-681
  test('OpenAI APIが正常応答した場合、根拠を自然言語で営業担当者向けに説明文として生成する', async () => {
    const recommendation_id = 'REC20240115001';
    const customer_industry = '製造業';
    const deal_stage = '提案準備段階';
    const success_pattern_ref_id = 'SP20240101005';
    const similar_cases_count = 3;
    const success_rate = 82;
    const pattern_name = '大手製造業向けコスト削減提案';

    const result = await explainRecommendationReasoning({
      recommendation_id,
      customer_industry,
      deal_stage,
      success_pattern_ref_id,
      similar_cases_count,
      success_rate,
      pattern_name,
    });

    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThanOrEqual(50);
    expect(result).not.toBe('');
    expect(result).not.toBeNull();

    expect(result).toMatch(/顧客|課題|提案|成功|案件|パターン/);

    expect(result).toMatch(new RegExp(customer_industry, 'u'));
    expect(result).toMatch(new RegExp(pattern_name, 'u'));
    expect(result).toMatch(/\d/);

    expect(result).toMatch(/。|、/);
    expect(result).not.toMatch(/\s{2,}/);

    expect(result).toContain(customer_industry);
    expect(result).toContain(pattern_name);
  });
});