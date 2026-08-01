import { generateSalesBehaviorAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-359
  test("成約率が50%以上のとき、正しく計算される", () => {
    // 営業担当者A のテストデータ: 成約件数 10件、商談件数 20件（成約率 50.0%）
    const salesPersonA = {
      id: "A",
      name: "営業担当者A",
      closed_deals: 10,
      total_deals: 20,
    };

    // 営業担当者B のテストデータ: 成約件数 5件、商談件数 15件（成約率 33.33%）
    const salesPersonB = {
      id: "B",
      name: "営業担当者B",
      closed_deals: 5,
      total_deals: 15,
    };

    // 営業担当者C のテストデータ: 成約件数 6件、商談件数 12件（成約率 50.0%）
    const salesPersonC = {
      id: "C",
      name: "営業担当者C",
      closed_deals: 6,
      total_deals: 12,
    };

    const sales_persons = [salesPersonA, salesPersonB, salesPersonC];

    // 行動パターン分析レポート生成機能を実行
    const report = generateSalesBehaviorAnalysisReport(sales_persons);

    // 生成されたレポート内の営業担当者ごとの成約率を確認
    expect(report).toBeDefined();
    expect(report.length).toBe(3);

    // 営業担当者A: 成約率 50.0%
    const reportA = report.find((r) => r.sales_person_id === "A");
    expect(reportA).toBeDefined();
    expect(reportA?.closing_rate).toBe(50.0);
    expect(reportA?.name).toBe("営業担当者A");

    // 営業担当者B: 成約率 33.33%
    const reportB = report.find((r) => r.sales_person_id === "B");
    expect(reportB).toBeDefined();
    expect(reportB?.closing_rate).toBeCloseTo(33.33, 2);
    expect(reportB?.name).toBe("営業担当者B");

    // 営業担当者C: 成約率 50.0%
    const reportC = report.find((r) => r.sales_person_id === "C");
    expect(reportC).toBeDefined();
    expect(reportC?.closing_rate).toBe(50.0);
    expect(reportC?.name).toBe("営業担当者C");

    // 成約率50%以上の営業担当者（AおよびC）が正確に識別される
    const high_performers = report.filter((r) => r.closing_rate >= 50.0);
    expect(high_performers.length).toBe(2);
    expect(high_performers.map((r) => r.sales_person_id)).toEqual(
      expect.arrayContaining(["A", "C"])
    );

    // レポート内に「成約率：50.0%」という具体的な数値で表示される
    expect(reportA?.display_text).toContain("成約率：50.0%");
    expect(reportC?.display_text).toContain("成約率：50.0%");
  });
});