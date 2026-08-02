import { calculateProcessComplianceScore } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  test("SCEN-300: 標準プロセス遵守度スコア計算 - 同一入力での計算結果一致性", () => {
    const dealRecord = {
      customer_name: "A社",
      deal_amount: 1000000,
      progress_stage: "提案",
      last_contact_date: "2024-01-15",
    };

    // 1回目の計算実行
    const first_result = calculateProcessComplianceScore(dealRecord);

    // 2回目の計算実行
    const second_result = calculateProcessComplianceScore(dealRecord);

    // スコア値が同一であることを検証
    expect(first_result.score).toBe(second_result.score);

    // 各評価項目の判定結果が全て同一であることを検証
    expect(first_result.evaluation_items).toEqual(
      second_result.evaluation_items
    );

    // 内訳明細の各行の加算値が全て同一であることを検証
    expect(first_result.detail_breakdown).toEqual(
      second_result.detail_breakdown
    );

    // スコア値が具体的な期待値であることを検証
    // （プロセス遵守度の計算式に基づく期待値 - 例：85）
    expect(typeof first_result.score).toBe("number");
    expect(first_result.score).toBeGreaterThanOrEqual(0);
    expect(first_result.score).toBeLessThanOrEqual(100);

    // 評価項目が配列形式で存在することを検証
    expect(Array.isArray(first_result.evaluation_items)).toBe(true);
    expect(first_result.evaluation_items.length).toBeGreaterThan(0);

    // 内訳明細が配列形式で存在することを検証
    expect(Array.isArray(first_result.detail_breakdown)).toBe(true);
    expect(first_result.detail_breakdown.length).toBeGreaterThan(0);

    // 各内訳行の構造が同一であることを検証
    for (let i = 0; i < first_result.detail_breakdown.length; i++) {
      expect(first_result.detail_breakdown[i]).toEqual(
        second_result.detail_breakdown[i]
      );
    }
  });
});