import { identifyImprovementTargets } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-200
  test("改善指導対象者リストの順序が乖離度の降順で正しく整列される", () => {
    const salespeople = [
      { id: "A001", divergence_degree: 45.2 },
      { id: "A002", divergence_degree: 78.5 },
      { id: "A003", divergence_degree: 32.1 },
      { id: "A004", divergence_degree: 89.3 },
      { id: "A005", divergence_degree: 56.7 },
    ];

    const result = identifyImprovementTargets(salespeople);

    expect(result).toEqual([
      { id: "A004", divergence_degree: 89.3 },
      { id: "A002", divergence_degree: 78.5 },
      { id: "A005", divergence_degree: 56.7 },
      { id: "A001", divergence_degree: 45.2 },
      { id: "A003", divergence_degree: 32.1 },
    ]);

    expect(result[0].id).toBe("A004");
    expect(result[0].divergence_degree).toBe(89.3);
    expect(result[1].id).toBe("A002");
    expect(result[1].divergence_degree).toBe(78.5);
    expect(result[2].id).toBe("A005");
    expect(result[2].divergence_degree).toBe(56.7);
    expect(result[3].id).toBe("A001");
    expect(result[3].divergence_degree).toBe(45.2);
    expect(result[4].id).toBe("A003");
    expect(result[4].divergence_degree).toBe(32.1);
  });
});