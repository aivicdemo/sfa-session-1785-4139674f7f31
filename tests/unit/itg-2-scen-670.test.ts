import { sortPastCasesByChronologicalOrder } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-670
  test("推奨内容根拠の可視化機能 - 過去事例の順序が時系列逆順のとき、時系列順に並び替えられる", () => {
    const pastCases = [
      {
        case_id: "case_001",
        event_date: "2024-01-15",
        customer_name: "顧客A",
        success_flag: true,
      },
      {
        case_id: "case_002",
        event_date: "2023-11-20",
        customer_name: "顧客B",
        success_flag: true,
      },
      {
        case_id: "case_003",
        event_date: "2023-08-05",
        customer_name: "顧客C",
        success_flag: false,
      },
    ];

    const sorted_cases = sortPastCasesByChronologicalOrder(pastCases);

    expect(sorted_cases).toEqual([
      {
        case_id: "case_003",
        event_date: "2023-08-05",
        customer_name: "顧客C",
        success_flag: false,
      },
      {
        case_id: "case_002",
        event_date: "2023-11-20",
        customer_name: "顧客B",
        success_flag: true,
      },
      {
        case_id: "case_001",
        event_date: "2024-01-15",
        customer_name: "顧客A",
        success_flag: true,
      },
    ]);
    expect(sorted_cases[0].event_date).toBe("2023-08-05");
    expect(sorted_cases[1].event_date).toBe("2023-11-20");
    expect(sorted_cases[2].event_date).toBe("2024-01-15");
  });
});