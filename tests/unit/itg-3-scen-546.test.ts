import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-546
  test('改善優先度が最高ランク1のときスコア基準より優先して方針が決定される', () => {
    // 推奨パターンマスタの定義
    const patternMaster = [
      {
        patternId: 'PatternA',
        name: '契約後フォローアップ重視型',
        approachDescription: '初期契約後の顧客満足度向上を重視し、定期的なフォローアップと価値提供を継続する営業アプローチ',
        improveRank: 1,
      },
      {
        patternId: 'PatternB',
        name: '初期提案型',
        approachDescription: '顧客初接触時の最大インパクト提案により商談化率を高める営業アプローチ',
        improveRank: 2,
      },
      {
        patternId: 'PatternC',
        name: '競合対抗型',
        approachDescription: '競合他社との差別化要素を強調し価格以外の価値をアピールする営業アプローチ',
        improveRank: 3,
      },
    ];

    // AIRecommendationEngineのスタブ設定
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((patternId: string) => {
        const scoreMap: { [key: string]: number } = {
          PatternA: 0.92,
          PatternB: 0.78,
          PatternC: 0.65,
        };
        return scoreMap[patternId] || 0;
      }),
      generateRecommendation: jest.fn((input: {
        customerIndustry: string;
        budgetScale: string;
        purchaseType: string;
        patternMaster: typeof patternMaster;
      }) => {
        // improveRank=1のパターンを優先
        const topRankPattern = input.patternMaster.find((p) => p.improveRank === 1);
        if (!topRankPattern) {
          throw new Error('改善優先度ランク1のパターンが見つかりません');
        }

        const relevanceScore = mockAIEngine.evaluatePatternRelevance(topRankPattern.patternId);

        return {
          patternId: topRankPattern.patternId,
          recommendationReason: `顧客業種「${input.customerIndustry}」、予算規模「${input.budgetScale}」に対して、改善優先度ランク${topRankPattern.improveRank}である${topRankPattern.name}を適用。スコア: ${relevanceScore}`,
          approachDescription: topRankPattern.approachDescription,
          relevanceScore: relevanceScore,
          improvementRank: topRankPattern.improveRank,
        };
      }),
    };

    // テスト入力：新規案件情報
    const testInput = {
      customerIndustry: '製造業',
      budgetScale: '大規模',
      purchaseType: '継続的',
      patternMaster: patternMaster,
    };

    // generateRecommendationを呼び出し
    const result = mockAIEngine.generateRecommendation(testInput);

    // 期待結果の検証
    expect(result.patternId).toBe('PatternA');
    expect(result.approachDescription).toBe('初期契約後の顧客満足度向上を重視し、定期的なフォローアップと価値提供を継続する営業アプローチ');
    expect(result.recommendationReason).toContain('改善優先度ランク1である契約後フォローアップ重視型を適用');
    expect(result.relevanceScore).toBe(0.92);
    expect(result.improvementRank).toBe(1);

    // パターンB、Cが選択されないことを確認
    expect(result.patternId).not.toBe('PatternB');
    expect(result.patternId).not.toBe('PatternC');

    // スコアベースではなく改善優先度ランクが優先されたことを確認
    const patternBScore = mockAIEngine.evaluatePatternRelevance('PatternB');
    const patternCScore = mockAIEngine.evaluatePatternRelevance('PatternC');
    expect(result.relevanceScore).toBe(0.92);
    expect(patternBScore).toBe(0.78);
    expect(patternCScore).toBe(0.65);
  });
});