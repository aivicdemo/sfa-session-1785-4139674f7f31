import { extractSalesPerformanceRanking } from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  // SCEN-466
  test("成約実績で上位の営業担当者が正常に抽出・順序付けされる", () => {
    const salespeople_input = [
      {
        sales_person_id: "A",
        sales_person_name: "営業担当者A",
        contract_count: 15,
        contract_amount: 30000000,
      },
      {
        sales_person_id: "B",
        sales_person_name: "営業担当者B",
        contract_count: 22,
        contract_amount: 45000000,
      },
      {
        sales_person_id: "C",
        sales_person_name: "営業担当者C",
        contract_count: 18,
        contract_amount: 35000000,
      },
      {
        sales_person_id: "D",
        sales_person_name: "営業担当者D",
        contract_count: 10,
        contract_amount: 20000000,
      },
    ];

    const result = extractSalesPerformanceRanking(salespeople_input, {
      sort_by: "contract_amount",
      period: "2024-01",
    });

    expect(result).toEqual([
      {
        rank: 1,
        sales_person_id: "B",
        sales_person_name: "営業担当者B",
        contract_count: 22,
        contract_amount: 45000000,
      },
      {
        rank: 2,
        sales_person_id: "C",
        sales_person_name: "営業担当者C",
        contract_count: 18,
        contract_amount: 35000000,
      },
      {
        rank: 3,
        sales_person_id: "A",
        sales_person_name: "営業担当者A",
        contract_count: 15,
        contract_amount: 30000000,
      },
      {
        rank: 4,
        sales_person_id: "D",
        sales_person_name: "営業担当者D",
        contract_count: 10,
        contract_amount: 20000000,
      },
    ]);
  });
});