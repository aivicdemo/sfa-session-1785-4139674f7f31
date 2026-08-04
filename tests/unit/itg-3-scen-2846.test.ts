import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2846
  test('推奨内容の標準プロセス乖離度判定機能 - 営業担当者の行動パターンが標準プロセスと部分的に異なった場合、乖離度スコアが0より大きく算出される', () => {
    // 標準プロセス: 初回接触 → ヒアリング → 提案 → フォローアップ
    const standardProcess = [
      { step: 1, activity: 'initial_contact' },
      { step: 2, activity: 'hearing' },
      { step: 3, activity: 'proposal' },
      { step: 4, activity: 'followup' },
    ];

    // 営業担当者の実際の行動パターン: 初回接触 → 提案 → ヒアリング → フォローアップ
    // （ヒアリングと提案の順序が入れ替わっている）
    const actualPattern = [
      { step: 1, activity: 'initial_contact' },
      { step: 2, activity: 'proposal' },
      { step: 3, activity: 'hearing' },
      { step: 4, activity: 'followup' },
    ];

    // evaluatePatternRelevance を呼び出し、乖離度スコアを計算
    const relevanceScore = evaluatePatternRelevance(
      standardProcess,
      actualPattern
    );

    // 期待結果: 乖離度スコアが 0 < スコア < 1.0 の範囲内に収まっていることを確認
    // 部分的な乖離があるため、完全一致ではなく（スコア < 1.0）、かつ完全に異なるわけでもない（スコア > 0）
    expect(relevanceScore).toBeGreaterThan(0);
    expect(relevanceScore).toBeLessThan(1.0);

    // さらに具体的な値の範囲を確認
    // ステップ構成は同じ（4ステップ）で、順序が1箇所異なるため、
    // スコアは 0.35 から 0.67 程度の範囲と予想される
    expect(relevanceScore).toBeGreaterThanOrEqual(0.35);
    expect(relevanceScore).toBeLessThanOrEqual(0.67);
  });
});