import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-054
  test('推奨根拠説明生成機能 - 根拠に使用された成功パターンが0件の場合に説明が正常に生成される', () => {
    // 入力: 成功パターン0件（空配列）を使用した根拠説明生成
    const recommendationId = 'REC-2024-001';
    const customerIndustry = 'manufacturing';
    const dealAmount = 5000000;
    const successPatterns = [];
    const recommendedApproach = 'standard_enterprise_solution';
    const alternativePatternSource = 'master_statistical_top';

    const reasoningText = explainRecommendationReasoning({
      recommendationId,
      customerIndustry,
      dealAmount,
      successPatterns,
      recommendedApproach,
      alternativePatternSource,
    });

    // 期待結果1: 例外をスローしない（正常に実行される）
    expect(reasoningText).toBeDefined();

    // 期待結果2: 説明文が空でない
    expect(reasoningText.length).toBeGreaterThan(0);

    // 期待結果3: 説明文が日本語の自然言語テキストである
    expect(typeof reasoningText).toBe('string');

    // 期待結果4: 代替パターン使用を示す文言が含まれている
    expect(reasoningText).toMatch(/類似した過去成功事例が見つかりませんでしたが/);
    expect(reasoningText).toMatch(/推奨パターンマスタから統計的に上位の成功パターンに基づいて/);

    // 期待結果5: 営業担当者向けのコンテキスト情報が含まれている
    expect(reasoningText).toMatch(/提案/);
  });
});