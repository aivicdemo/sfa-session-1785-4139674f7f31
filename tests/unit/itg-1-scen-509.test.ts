import { generateSalesPersonAnalysisReport } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-509
  test("複数の営業担当者の行動パターンデータが降順で正しくソートされる", () => {
    const salesPersonsData = [
      {
        salesPersonId: "SP001",
        salesPersonName: "A氏",
        visitCount: 50,
        proposalCount: 12,
        contractCount: 3,
      },
      {
        salesPersonId: "SP002",
        salesPersonName: "B氏",
        visitCount: 120,
        proposalCount: 28,
        contractCount: 8,
      },
      {
        salesPersonId: "SP003",
        salesPersonName: "C氏",
        visitCount: 80,
        proposalCount: 18,
        contractCount: 5,
      },
      {
        salesPersonId: "SP004",
        salesPersonName: "D氏",
        visitCount: 45,
        proposalCount: 10,
        contractCount: 2,
      },
      {
        salesPersonId: "SP005",
        salesPersonName: "E氏",
        visitCount: 95,
        proposalCount: 22,
        contractCount: 6,
      },
    ];

    const report = generateSalesPersonAnalysisReport(
      salesPersonsData,
      "visitCount",
      "desc"
    );

    expect(report.salesPersons).toHaveLength(5);

    expect(report.salesPersons[0]).toEqual({
      salesPersonId: "SP002",
      salesPersonName: "B氏",
      visitCount: 120,
      proposalCount: 28,
      contractCount: 8,
    });

    expect(report.salesPersons[1]).toEqual({
      salesPersonId: "SP005",
      salesPersonName: "E氏",
      visitCount: 95,
      proposalCount: 22,
      contractCount: 6,
    });

    expect(report.salesPersons[2]).toEqual({
      salesPersonId: "SP003",
      salesPersonName: "C氏",
      visitCount: 80,
      proposalCount: 18,
      contractCount: 5,
    });

    expect(report.salesPersons[3]).toEqual({
      salesPersonId: "SP001",
      salesPersonName: "A氏",
      visitCount: 50,
      proposalCount: 12,
      contractCount: 3,
    });

    expect(report.salesPersons[4]).toEqual({
      salesPersonId: "SP004",
      salesPersonName: "D氏",
      visitCount: 45,
      proposalCount: 10,
      contractCount: 2,
    });

    expect(report.sortField).toBe("visitCount");
    expect(report.sortOrder).toBe("desc");
  });
});