import { evaluateRecommendationBasis } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1743
  test('根拠ウェイトがちょうど0.5のとき根拠優先度を正しく判定する', () => {
    const basis_weight = 0.5;
    const basis_data = {
      recommendation_id: 'rec_123',
      basis_type: 'past_success_pattern',
      weight: basis_weight,
      description: 'Similar customer pattern matched',
      supporting_data: ['customer_size_large', 'industry_manufacturing'],
    };

    const result = evaluateRecommendationBasis(basis_data);

    expect(result.priority_level).toBe('medium');
    expect(result.weight).toBe(0.5);
    expect(result.is_visible).toBe(true);
  });
});