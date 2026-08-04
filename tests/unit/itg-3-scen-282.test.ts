import { explainRecommendationReasons } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-282
  test('推奨根拠が複数件のとき、すべての根拠が説明文に統合される', () => {
    const recommendationId = 'rec_20240115_001';
    const customerId = 'cust_12345';
    const dealId = 'deal_98765';

    const multipleReasons = [
      {
        reasonId: 'reason_001',
        reasonType: 'industry_pattern',
        description: '顧客業界が製造業',
        metric: '過去成功事例の80%が同業種',
        numericalValue: 80,
        weight: 0.35,
      },
      {
        reasonId: 'reason_002',
        reasonType: 'proposal_amount_band',
        description: '提案金額が500万〜1000万円帯',
        metric: '当該帯域での契約率が75%',
        numericalValue: 75,
        weight: 0.33,
      },
      {
        reasonId: 'reason_003',
        reasonType: 'decision_maker_level',
        description: '決定者が経営層',
        metric: '経営層向けアプローチの成約期間が平均45日',
        numericalValue: 45,
        weight: 0.32,
      },
    ];

    const generatedExplanation = explainRecommendationReasons(
      recommendationId,
      customerId,
      dealId,
      multipleReasons,
    );

    expect(generatedExplanation).toBeDefined();
    expect(typeof generatedExplanation).toBe('string');
    expect(generatedExplanation.length).toBeGreaterThan(0);

    expect(generatedExplanation).toMatch(/製造業/);
    expect(generatedExplanation).toMatch(/500万〜1000万円/);
    expect(generatedExplanation).toMatch(/経営層/);
    expect(generatedExplanation).toMatch(/80%/);
    expect(generatedExplanation).toMatch(/75%/);
    expect(generatedExplanation).toMatch(/45日/);

    expect(generatedExplanation).toMatch(/([、。、です。推奨します。]|[のため|であり|かつ])/);
  });
});