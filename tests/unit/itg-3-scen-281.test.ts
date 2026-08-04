import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-281
  test('推奨根拠が1件のとき、その単一の根拠がそのまま説明文に組み込まれる', () => {
    const singleReason = '顧客業種が過去成功事例と一致している';
    const recommendationData = {
      reasons: [singleReason],
    };

    const result = explainRecommendationReasoning(recommendationData);

    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
    expect(result).toContain(singleReason);
    expect(result.includes('推奨')).toBe(true);
  });
});