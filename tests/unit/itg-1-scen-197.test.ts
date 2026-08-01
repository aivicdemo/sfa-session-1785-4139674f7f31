import { analyzeSalesRepBehaviorPattern } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-197
  test('同じ分析入力で2回実行しても同じ改善指導対象者と指導内容が返される', () => {
    const analysisInput = {
      salesRepId: 'SA001',
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-01-31',
      salesTargetAchievementRate: 75,
      customerVisitCount: 12,
      proposalDocumentCount: 8,
    };

    // 1回目の実行
    const firstExecutionResult = analyzeSalesRepBehaviorPattern(analysisInput);

    // 1回目の結果をローカル変数に保存
    const firstTargetSalesReps = firstExecutionResult.improvementTargetList;
    const firstGuidanceContent = firstExecutionResult.guidanceDetails;

    // 2回目の実行（同一の入力データを使用）
    const secondExecutionResult = analyzeSalesRepBehaviorPattern(analysisInput);

    // 2回目の結果をローカル変数に保存
    const secondTargetSalesReps = secondExecutionResult.improvementTargetList;
    const secondGuidanceContent = secondExecutionResult.guidanceDetails;

    // 改善指導対象者リストの比較
    expect(firstTargetSalesReps.length).toBe(secondTargetSalesReps.length);
    expect(firstTargetSalesReps).toEqual(secondTargetSalesReps);

    // 指導内容の比較：指導カテゴリ
    expect(firstGuidanceContent.map((g) => g.guidanceCategory)).toEqual(
      secondGuidanceContent.map((g) => g.guidanceCategory)
    );

    // 指導内容の比較：改善ポイント
    expect(firstGuidanceContent.map((g) => g.improvementPoint)).toEqual(
      secondGuidanceContent.map((g) => g.improvementPoint)
    );

    // 指導内容の比較：推奨アクション
    expect(firstGuidanceContent.map((g) => g.recommendedAction)).toEqual(
      secondGuidanceContent.map((g) => g.recommendedAction)
    );

    // 結果の順序が同じであることを確認
    expect(firstGuidanceContent).toEqual(secondGuidanceContent);
  });
});