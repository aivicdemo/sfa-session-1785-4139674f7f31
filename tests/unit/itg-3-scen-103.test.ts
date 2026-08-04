import { validateRecommendationPatternsExist } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 過去成功パターンデータ検証', () => {
  // SCEN-103
  test('過去成功パターンデータが0件のとき推論実行が拒否される', () => {
    const newDealCondition = {
      customerName: '株式会社サンプル',
      industry: '製造業',
      budget: 5000000,
      challengeDescription: '生産効率の向上',
    };

    const patternDataCount = 0;

    expect(() => {
      validateRecommendationPatternsExist(
        newDealCondition,
        patternDataCount,
      );
    }).toThrow(/パターンデータ不足/);
  });
});