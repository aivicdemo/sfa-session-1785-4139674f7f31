import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨機能', () => {
  // SCEN-1795
  test('複数の適用可能な成功パターンが提案アプローチリストとして推奨される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        patterns: [
          {
            approach_name: '段階的導入提案',
            applicability_score: 0.92,
            reasoning: '金融機関の大規模システムは段階的導入により導入リスク低減が実績あり'
          },
          {
            approach_name: '経営層への事業効果説明',
            applicability_score: 0.87,
            reasoning: 'CIO層への意思決定支援には事業効果定量化が有効'
          },
          {
            approach_name: '競合他社との差別化ポイント提示',
            applicability_score: 0.81,
            reasoning: 'システム老朽化課題の解決において競合優位性訴求が重要'
          }
        ]
      })
    };

    const deal_condition = {
      customer_industry: '金融機関',
      issue: 'システム老朽化',
      budget_range: '5000万円以上',
      decision_maker: 'CIO'
    };

    const result = await generateRecommendation(deal_condition, mockAIEngine);

    expect(result.patterns).toHaveLength(3);
    expect(result.patterns[0].approach_name).toBe('段階的導入提案');
    expect(result.patterns[0].applicability_score).toBe(0.92);
    expect(result.patterns[0].reasoning).toContain('段階的導入');

    expect(result.patterns[1].approach_name).toBe('経営層への事業効果説明');
    expect(result.patterns[1].applicability_score).toBe(0.87);
    expect(result.patterns[1].reasoning).toContain('事業効果');

    expect(result.patterns[2].approach_name).toBe('競合他社との差別化ポイント提示');
    expect(result.patterns[2].applicability_score).toBe(0.81);
    expect(result.patterns[2].reasoning).toContain('競合');

    expect(result.patterns[0].applicability_score).toBeGreaterThan(
      result.patterns[1].applicability_score
    );
    expect(result.patterns[1].applicability_score).toBeGreaterThan(
      result.patterns[2].applicability_score
    );

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(deal_condition);
  });
});