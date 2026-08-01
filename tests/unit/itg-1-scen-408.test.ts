import { analyzeAndGenerateReport } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-408
  test("[normal] 複数の営業担当者の分析データが混在する場合、営業担当者ごとに正確に分離されて処理される", () => {
    const analysisInput = {
      batch: [
        {
          sales_rep_id: "A001",
          visit_date: "2024-01-15",
          customer_id: "C001",
          contract_amount: 500000,
        },
        {
          sales_rep_id: "B001",
          visit_date: "2024-01-15",
          customer_id: "C002",
          contract_amount: 300000,
        },
        {
          sales_rep_id: "A001",
          visit_date: "2024-01-16",
          customer_id: "C003",
          contract_amount: 200000,
        },
      ],
    };

    const report = analyzeAndGenerateReport(analysisInput);

    const repA = report.reports.find(
      (r: { sales_rep_id: string }) => r.sales_rep_id === "A001"
    );
    const repB = report.reports.find(
      (r: { sales_rep_id: string }) => r.sales_rep_id === "B001"
    );

    expect(repA.visit_count).toBe(2);
    expect(repA.total_contract_amount).toBe(700000);
    expect(repA.visits).toEqual([
      { visit_date: "2024-01-15", customer_id: "C001", contract_amount: 500000 },
      { visit_date: "2024-01-16", customer_id: "C003", contract_amount: 200000 },
    ]);

    expect(repB.visit_count).toBe(1);
    expect(repB.total_contract_amount).toBe(300000);
    expect(repB.visits).toEqual([
      { visit_date: "2024-01-15", customer_id: "C002", contract_amount: 300000 },
    ]);

    expect(repA.visits.some((v: { customer_id: string }) => v.customer_id === "C002")).toBe(
      false
    );
    expect(repB.visits.some((v: { customer_id: string }) => v.customer_id === "C001")).toBe(
      false
    );
    expect(repB.visits.some((v: { customer_id: string }) => v.customer_id === "C003")).toBe(
      false
    );
  });
});