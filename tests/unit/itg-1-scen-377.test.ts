import { generateActionPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  test("SCEN-377: 複数営業担当者の混在データが入力されたとき、担当者ごとに正しく分離される", () => {
    // テストデータ準備: 営業担当者A、B、Cの混在データ
    const mixedData = [
      {
        salespersonId: "A001",
        salespersonName: "営業担当者A",
        visitCount: 5,
        proposalCount: 3,
        contractAmount: 500000,
      },
      {
        salespersonId: "B001",
        salespersonName: "営業担当者B",
        visitCount: 7,
        proposalCount: 4,
        contractAmount: 800000,
      },
      {
        salespersonId: "A001",
        salespersonName: "営業担当者A",
        visitCount: 3,
        proposalCount: 2,
        contractAmount: 300000,
      },
      {
        salespersonId: "C001",
        salespersonName: "営業担当者C",
        visitCount: 6,
        proposalCount: 5,
        contractAmount: 1200000,
      },
      {
        salespersonId: "B001",
        salespersonName: "営業担当者B",
        visitCount: 4,
        proposalCount: 2,
        contractAmount: 400000,
      },
      {
        salespersonId: "C001",
        salespersonName: "営業担当者C",
        visitCount: 2,
        proposalCount: 1,
        contractAmount: 150000,
      },
      {
        salespersonId: "A001",
        salespersonName: "営業担当者A",
        visitCount: 2,
        proposalCount: 1,
        contractAmount: 200000,
      },
    ];

    // レポート生成処理実行
    const report = generateActionPatternAnalysisReport(mixedData);

    // 営業担当者Aのデータセクション検証
    const sectionA = report.sections.find(
      (section: { salespersonId: string }) => section.salespersonId === "A001"
    );
    expect(sectionA).toBeDefined();
    expect(sectionA.salespersonName).toBe("営業担当者A");
    expect(sectionA.data).toHaveLength(3);
    expect(sectionA.data.every((d: { salespersonId: string }) => d.salespersonId === "A001")).toBe(true);
    expect(sectionA.totalVisitCount).toBe(10); // 5 + 3 + 2
    expect(sectionA.totalProposalCount).toBe(6); // 3 + 2 + 1
    expect(sectionA.totalContractAmount).toBe(1000000); // 500000 + 300000 + 200000

    // 営業担当者Bのデータセクション検証
    const sectionB = report.sections.find(
      (section: { salespersonId: string }) => section.salespersonId === "B001"
    );
    expect(sectionB).toBeDefined();
    expect(sectionB.salespersonName).toBe("営業担当者B");
    expect(sectionB.data).toHaveLength(2);
    expect(sectionB.data.every((d: { salespersonId: string }) => d.salespersonId === "B001")).toBe(true);
    expect(sectionB.totalVisitCount).toBe(11); // 7 + 4
    expect(sectionB.totalProposalCount).toBe(6); // 4 + 2
    expect(sectionB.totalContractAmount).toBe(1200000); // 800000 + 400000

    // 営業担当者Cのデータセクション検証
    const sectionC = report.sections.find(
      (section: { salespersonId: string }) => section.salespersonId === "C001"
    );
    expect(sectionC).toBeDefined();
    expect(sectionC.salespersonName).toBe("営業担当者C");
    expect(sectionC.data).toHaveLength(2);
    expect(sectionC.data.every((d: { salespersonId: string }) => d.salespersonId === "C001")).toBe(true);
    expect(sectionC.totalVisitCount).toBe(8); // 6 + 2
    expect(sectionC.totalProposalCount).toBe(6); // 5 + 1
    expect(sectionC.totalContractAmount).toBe(1350000); // 1200000 + 150000

    // レポート全体の構成検証
    expect(report.sections).toHaveLength(3);
    expect(report.sections.map((s: { salespersonId: string }) => s.salespersonId).sort()).toEqual([
      "A001",
      "B001",
      "C001",
    ]);

    // 各セクションに他の担当者のデータが混在していないことを確認
    report.sections.forEach((section: { salespersonId: string; data: { salespersonId: string }[] }) => {
      section.data.forEach((dataItem: { salespersonId: string }) => {
        expect(dataItem.salespersonId).toBe(section.salespersonId);
      });
    });
  });
});