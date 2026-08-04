import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-684
  test('推奨根拠が1件のとき、その根拠に基づいた説明文を生成する', () => {
    const singleRecommendationBasis = {
      patternId: 'PAT-001',
      customerScale: '中堅企業',
      industry: '製造業',
      successRate: 92,
    };

    const explanation = explainRecommendationReasoning([singleRecommendationBasis]);

    expect(explanation).toMatch(/PAT-001/);
    expect(explanation).toMatch(/中堅企業/);
    expect(explanation).toMatch(/製造業/);
    expect(explanation).toMatch(/92/);

    expect(explanation.length).toBeGreaterThanOrEqual(100);
    expect(explanation.length).toBeLessThanOrEqual(1000);

    expect(explanation).not.toMatch(/共通点/);
    expect(explanation).not.toMatch(/複数/);
    expect(explanation).not.toMatch(/比較/);
  });
});