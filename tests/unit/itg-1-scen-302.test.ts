import { determinePrioritizationOrder } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-302: 複数営業担当者が同一の乖離度・成約実績相関値である場合、優先順位の順序が確定的に決定される", () => {
    // 3名の営業担当者（A、B、C）のデータを準備
    // 乖離度: 65%, 成約実績相関値: 0.78
    const salesRepA = {
      sales_rep_id: "A",
      deviation_rate: 0.65,
      contract_result_correlation: 0.78,
      name: "営業担当者A",
    };

    const salesRepB = {
      sales_rep_id: "B",
      deviation_rate: 0.65,
      contract_result_correlation: 0.78,
      name: "営業担当者B",
    };

    const salesRepC = {
      sales_rep_id: "C",
      deviation_rate: 0.65,
      contract_result_correlation: 0.78,
      name: "営業担当者C",
    };

    const inputData = [salesRepA, salesRepB, salesRepC];

    // 1回目の判定実行
    const result1 = determinePrioritizationOrder(inputData);
    const order1 = result1.map((item) => item.sales_rep_id);

    // 2回目の判定実行
    const result2 = determinePrioritizationOrder(inputData);
    const order2 = result2.map((item) => item.sales_rep_id);

    // 3回目の判定実行
    const result3 = determinePrioritizationOrder(inputData);
    const order3 = result3.map((item) => item.sales_rep_id);

    // 1回目・2回目・3回目の優先順位が完全に一致していることを検証
    expect(order1).toEqual(order2);
    expect(order2).toEqual(order3);

    // 優先順位リストが3名全員を含んでいることを検証
    expect(result1).toHaveLength(3);
    expect(result2).toHaveLength(3);
    expect(result3).toHaveLength(3);

    // 同じ順序が確定的に返されていることを確認
    expect(order1).toBeDefined();
    expect(order1.length).toBe(3);
    expect(order1).toEqual(expect.arrayContaining(["A", "B", "C"]));
  });
});