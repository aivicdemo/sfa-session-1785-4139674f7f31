import { calculateImprovementPriorityScores } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-676: 改善優先度スコア算出機能 - 同じ入力で2回実行したときと同じ優先度スコアと順序が返される', () => {
    // 入力データセット: 営業プロセス項目5件
    const improvementItems = [
      {
        processItemId: 'item_1',
        processItemName: '初回接触',
        improvementEffectScore: 8.5,
        executabilityScore: 9.2,
        riskIndicator: 0.15
      },
      {
        processItemId: 'item_2',
        processItemName: '提案資料作成',
        improvementEffectScore: 7.2,
        executabilityScore: 8.1,
        riskIndicator: 0.22
      },
      {
        processItemId: 'item_3',
        processItemName: '顧客ニーズ分析',
        improvementEffectScore: 6.8,
        executabilityScore: 7.5,
        riskIndicator: 0.28
      },
      {
        processItemId: 'item_4',
        processItemName: 'フォローアップ',
        improvementEffectScore: 5.5,
        executabilityScore: 8.8,
        riskIndicator: 0.18
      },
      {
        processItemId: 'item_5',
        processItemName: '成約後対応',
        improvementEffectScore: 4.1,
        executabilityScore: 7.2,
        riskIndicator: 0.35
      }
    ];

    // 1回目の実行
    const firstExecutionResult = calculateImprovementPriorityScores(improvementItems);

    // 2回目の実行（同一入力）
    const secondExecutionResult = calculateImprovementPriorityScores(improvementItems);

    // 1回目と2回目の優先度スコアが完全に一致することを検証
    expect(firstExecutionResult).toHaveLength(5);
    expect(secondExecutionResult).toHaveLength(5);

    // ランク1位: 改善スコア 8.5
    expect(firstExecutionResult[0].priorityRank).toBe(1);
    expect(firstExecutionResult[0].improvementScore).toBe(8.5);
    expect(firstExecutionResult[0].priorityScore).toBeDefined();
    const rank1FirstScore = firstExecutionResult[0].priorityScore;

    expect(secondExecutionResult[0].priorityRank).toBe(1);
    expect(secondExecutionResult[0].improvementScore).toBe(8.5);
    expect(secondExecutionResult[0].priorityScore).toBe(rank1FirstScore);

    // ランク2位: 改善スコア 7.2
    expect(firstExecutionResult[1].priorityRank).toBe(2);
    expect(firstExecutionResult[1].improvementScore).toBe(7.2);
    const rank2FirstScore = firstExecutionResult[1].priorityScore;

    expect(secondExecutionResult[1].priorityRank).toBe(2);
    expect(secondExecutionResult[1].improvementScore).toBe(7.2);
    expect(secondExecutionResult[1].priorityScore).toBe(rank2FirstScore);

    // ランク3位: 改善スコア 6.8
    expect(firstExecutionResult[2].priorityRank).toBe(3);
    expect(firstExecutionResult[2].improvementScore).toBe(6.8);
    const rank3FirstScore = firstExecutionResult[2].priorityScore;

    expect(secondExecutionResult[2].priorityRank).toBe(3);
    expect(secondExecutionResult[2].improvementScore).toBe(6.8);
    expect(secondExecutionResult[2].priorityScore).toBe(rank3FirstScore);

    // ランク4位: 改善スコア 5.5
    expect(firstExecutionResult[3].priorityRank).toBe(4);
    expect(firstExecutionResult[3].improvementScore).toBe(5.5);
    const rank4FirstScore = firstExecutionResult[3].priorityScore;

    expect(secondExecutionResult[3].priorityRank).toBe(4);
    expect(secondExecutionResult[3].improvementScore).toBe(5.5);
    expect(secondExecutionResult[3].priorityScore).toBe(rank4FirstScore);

    // ランク5位: 改善スコア 4.1
    expect(firstExecutionResult[4].priorityRank).toBe(5);
    expect(firstExecutionResult[4].improvementScore).toBe(4.1);
    const rank5FirstScore = firstExecutionResult[4].priorityScore;

    expect(secondExecutionResult[4].priorityRank).toBe(5);
    expect(secondExecutionResult[4].improvementScore).toBe(4.1);
    expect(secondExecutionResult[4].priorityScore).toBe(rank5FirstScore);

    // 優先順位の順序が変わらないことを検証
    expect(firstExecutionResult.map(item => item.processItemId)).toEqual(
      secondExecutionResult.map(item => item.processItemId)
    );
  });
});