import { determineImprovementPriorityRank } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 改善優先度ランク決定", () => {
  // SCEN-422
  test("エラー件数が複数件の場合、件数に応じたランクが正しく決定される", () => {
    // エラー件数1件のケース: ランク『低』
    const result_1_error = determineImprovementPriorityRank(1);
    expect(result_1_error.rank).toBe("低");
    expect(result_1_error.priorityScore).toBe(1);

    // エラー件数5件のケース: ランク『中』
    const result_5_errors = determineImprovementPriorityRank(5);
    expect(result_5_errors.rank).toBe("中");
    expect(result_5_errors.priorityScore).toBe(2);

    // エラー件数10件のケース: ランク『高』
    const result_10_errors = determineImprovementPriorityRank(10);
    expect(result_10_errors.rank).toBe("高");
    expect(result_10_errors.priorityScore).toBe(3);

    // エラー件数20件以上のケース: ランク『緊急』
    const result_20_errors = determineImprovementPriorityRank(20);
    expect(result_20_errors.rank).toBe("緊急");
    expect(result_20_errors.priorityScore).toBe(4);

    // 件数が段階的に上昇していることを確認
    expect(result_1_error.priorityScore).toBeLessThan(
      result_5_errors.priorityScore
    );
    expect(result_5_errors.priorityScore).toBeLessThan(
      result_10_errors.priorityScore
    );
    expect(result_10_errors.priorityScore).toBeLessThan(
      result_20_errors.priorityScore
    );
  });
});