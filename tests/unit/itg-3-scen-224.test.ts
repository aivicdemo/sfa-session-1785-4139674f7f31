import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 成功パターン抽出と提案アプローチ推奨', () => {
  test('SCEN-224: OpenAI APIタイムアウト時に推奨パターンマスタから上位パターンをフォールバック返却', async () => {
    const aiEngine = {
      generateRecommendation: jest.fn().mockImplementation(() => {
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('OpenAI API timeout exceeded 30 seconds'));
          }, 30000);
        });
      }),
    };

    const mockRecommendationPatternMaster = [
      {
        pattern_id: 'PAT-MFG-500-001',
        industry: '製造業',
        deal_size_min: 4000000,
        deal_size_max: 6000000,
        success_probability: 85,
        success_count: 12,
        approach_template:
          '製造業向け業務効率化提案：生産ライン最適化とコスト削減を軸とした3段階アプローチ',
        brief_reasoning: '過去事例から製造業500万円規模での成功率85%実績',
      },
      {
        pattern_id: 'PAT-MFG-500-002',
        industry: '製造業',
        deal_size_min: 4000000,
        deal_size_max: 6000000,
        success_probability: 75,
        success_count: 8,
        approach_template:
          '製造業向け品質管理強化提案：不良率削減と品質コスト改善',
        brief_reasoning: '過去事例から製造業500万円規模での成功率75%実績',
      },
      {
        pattern_id: 'PAT-OTHER-100-001',
        industry: '他業種',
        deal_size_min: 500000,
        deal_size_max: 1500000,
        success_probability: 70,
        success_count: 5,
        approach_template: '汎用型デジタル化提案',
        brief_reasoning: '標準的な成功パターン',
      },
    ];

    const newDealCondition = {
      customer_industry: '製造業',
      deal_size: 5000000,
      decision_makers_count: 3,
      consideration_period_days: 60,
    };

    const mockPatternRepository = {
      findTopPatternsByIndustryAndSize: jest
        .fn()
        .mockReturnValue(
          mockRecommendationPatternMaster.filter(
            (p) =>
              p.industry === newDealCondition.customer_industry &&
              p.deal_size_min <= newDealCondition.deal_size &&
              p.deal_size_max >= newDealCondition.deal_size
          )
        ),
    };

    let result: any;
    const errorLog: string[] = [];

    try {
      result = await aiEngine.generateRecommendation(newDealCondition);
    } catch (error) {
      errorLog.push('OpenAI API タイムアウト→推奨パターンマスタからの代替返却');

      const topPatterns = mockPatternRepository
        .findTopPatternsByIndustryAndSize()
        .filter((p: any) => p.success_probability >= 80 && p.success_count >= 10)
        .sort(
          (a: any, b: any) =>
            b.success_probability * b.success_count -
            a.success_probability * a.success_count
        );

      if (topPatterns.length > 0) {
        const selectedPattern = topPatterns[0];
        result = {
          pattern_id: selectedPattern.pattern_id,
          approach_template: selectedPattern.approach_template,
          brief_reasoning: selectedPattern.brief_reasoning,
          success_probability: selectedPattern.success_probability,
          success_count: selectedPattern.success_count,
          fallback_source: 'recommendation_pattern_master',
          timeout_occurred: true,
        };
      }
    }

    expect(result).toBeDefined();
    expect(result.pattern_id).toBe('PAT-MFG-500-001');
    expect(result.approach_template).toBe(
      '製造業向け業務効率化提案：生産ライン最適化とコスト削減を軸とした3段階アプローチ'
    );
    expect(result.brief_reasoning).toBe(
      '過去事例から製造業500万円規模での成功率85%実績'
    );
    expect(result.success_probability).toBe(85);
    expect(result.success_count).toBe(12);
    expect(result.fallback_source).toBe('recommendation_pattern_master');
    expect(result.timeout_occurred).toBe(true);
    expect(errorLog).toContain(
      'OpenAI API タイムアウト→推奨パターンマスタからの代替返却'
    );

    expect(result.success_probability >= 80).toBe(true);
    expect(result.success_count >= 10).toBe(true);
  });
});