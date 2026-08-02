import { calculateProcessComplianceScore } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業プロセス実行状況分析機能", () => {
  test("SCEN-794: 改善指導優先度が高から低へ正しくソートされる", () => {
    const improvement_guidance_list = [
      {
        guidance_id: "GD001",
        salesperson_id: "SP001",
        priority_level: 2,
        guidance_content: "提案資料の品質向上",
        compliance_deviation: 15,
      },
      {
        guidance_id: "GD002",
        salesperson_id: "SP002",
        priority_level: 3,
        guidance_content: "初回接触タイミングの改善",
        compliance_deviation: 45,
      },
      {
        guidance_id: "GD003",
        salesperson_id: "SP003",
        priority_level: 1,
        guidance_content: "接触頻度の増加",
        compliance_deviation: 5,
      },
      {
        guidance_id: "GD004",
        salesperson_id: "SP004",
        priority_level: 3,
        guidance_content: "交渉スキルの強化",
        compliance_deviation: 40,
      },
      {
        guidance_id: "GD005",
        salesperson_id: "SP005",
        priority_level: 2,
        guidance_content: "顧客ニーズ分析の深掘り",
        compliance_deviation: 20,
      },
      {
        guidance_id: "GD006",
        salesperson_id: "SP006",
        priority_level: 3,
        guidance_content: "提案タイミングの最適化",
        compliance_deviation: 50,
      },
    ];

    const sorted_result = calculateProcessComplianceScore(
      improvement_guidance_list
    );

    const priority_levels = sorted_result.map((item) => item.priority_level);
    expect(priority_levels).toEqual([3, 3, 3, 2, 2, 1]);

    expect(sorted_result[0].guidance_id).toBe("GD006");
    expect(sorted_result[1].guidance_id).toBe("GD002");
    expect(sorted_result[2].guidance_id).toBe("GD004");
    expect(sorted_result[3].guidance_id).toBe("GD005");
    expect(sorted_result[4].guidance_id).toBe("GD001");
    expect(sorted_result[5].guidance_id).toBe("GD003");
  });
});