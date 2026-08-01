import { analyzeMultipleSalesPersonBehaviorPatterns } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-821
  test("複数の営業担当者の行動パターンを同時分析するとき、営業担当者ごとに独立した分析結果を出力する", () => {
    // Arrange: 営業担当者A、B、Cの行動パターンデータを用意
    const salesPersonA = {
      id: "SP-001",
      name: "営業担当者A",
      visitFrequency: 45,
      proposalCount: 8,
    };

    const salesPersonB = {
      id: "SP-002",
      name: "営業担当者B",
      visitFrequency: 12,
      proposalCount: 24,
    };

    const salesPersonC = {
      id: "SP-003",
      name: "営業担当者C",
      visitFrequency: 28,
      proposalCount: 16,
    };

    const analysisTargets = [salesPersonA, salesPersonB, salesPersonC];

    // 分析対象期間: 2024年1月～3月
    const analysisStartDate = new Date("2024-01-01T00:00:00Z");
    const analysisEndDate = new Date("2024-03-31T23:59:59Z");

    // Act: 行動パターン分析機能を実行
    const analysisResult = analyzeMultipleSalesPersonBehaviorPatterns({
      salesPersons: analysisTargets,
      analysisStartDate: analysisStartDate,
      analysisEndDate: analysisEndDate,
    });

    // Assert: 営業担当者ごとの独立した分析結果が出力されることを検証
    expect(analysisResult).toBeDefined();
    expect(analysisResult.results).toHaveLength(3);

    // 営業担当者Aの分析結果を検証
    const resultA = analysisResult.results.find(
      (r: { salesPersonId: string }) => r.salesPersonId === "SP-001"
    );
    expect(resultA).toBeDefined();
    expect(resultA.salesPersonId).toBe("SP-001");
    expect(resultA.visitFrequencyPerMonth).toBe(45);
    expect(resultA.proposalCountPerMonth).toBe(8);

    // 営業担当者Bの分析結果を検証
    const resultB = analysisResult.results.find(
      (r: { salesPersonId: string }) => r.salesPersonId === "SP-002"
    );
    expect(resultB).toBeDefined();
    expect(resultB.salesPersonId).toBe("SP-002");
    expect(resultB.visitFrequencyPerMonth).toBe(12);
    expect(resultB.proposalCountPerMonth).toBe(24);

    // 営業担当者Cの分析結果を検証
    const resultC = analysisResult.results.find(
      (r: { salesPersonId: string }) => r.salesPersonId === "SP-003"
    );
    expect(resultC).toBeDefined();
    expect(resultC.salesPersonId).toBe("SP-003");
    expect(resultC.visitFrequencyPerMonth).toBe(28);
    expect(resultC.proposalCountPerMonth).toBe(16);

    // 各分析結果が相互に混在していないことを検証
    expect(resultA.visitFrequencyPerMonth).not.toBe(
      resultB.visitFrequencyPerMonth
    );
    expect(resultA.visitFrequencyPerMonth).not.toBe(
      resultC.visitFrequencyPerMonth
    );
    expect(resultB.visitFrequencyPerMonth).not.toBe(
      resultC.visitFrequencyPerMonth
    );

    expect(resultA.proposalCountPerMonth).not.toBe(
      resultB.proposalCountPerMonth
    );
    expect(resultA.proposalCountPerMonth).not.toBe(
      resultC.proposalCountPerMonth
    );
    expect(resultB.proposalCountPerMonth).not.toBe(
      resultC.proposalCountPerMonth
    );

    // 分析期間が正しく設定されていることを検証
    expect(analysisResult.analysisStartDate).toEqual(analysisStartDate);
    expect(analysisResult.analysisEndDate).toEqual(analysisEndDate);
  });
});