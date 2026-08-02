import { calculateImprovementPriority } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-331
  test("乖離度が負の値となる場合、改善指導の優先順位が適切に計算される", () => {
    const records = [
      {
        recordId: "rec_001",
        deviationScore: -15.5,
        improvementItem: "顧客情報精度",
        importanceCoefficient: 1.2,
      },
      {
        recordId: "rec_002",
        deviationScore: -8.0,
        improvementItem: "売上予測精度",
        importanceCoefficient: 1.5,
      },
      {
        recordId: "rec_003",
        deviationScore: -22.3,
        improvementItem: "営業活動記録完全性",
        importanceCoefficient: 0.9,
      },
    ];

    const result = calculateImprovementPriority(records);

    expect(result).toHaveLength(3);

    expect(result[0]).toEqual({
      recordId: "rec_001",
      deviationScore: -15.5,
      improvementItem: "顧客情報精度",
      importanceCoefficient: 1.2,
      priorityScore: 18.6,
      priority: 2,
    });

    expect(result[1]).toEqual({
      recordId: "rec_003",
      deviationScore: -22.3,
      improvementItem: "営業活動記録完全性",
      importanceCoefficient: 0.9,
      priorityScore: 20.07,
      priority: 1,
    });

    expect(result[2]).toEqual({
      recordId: "rec_002",
      deviationScore: -8.0,
      improvementItem: "売上予測精度",
      importanceCoefficient: 1.5,
      priorityScore: 12.0,
      priority: 3,
    });

    const priorityScores = result.map((r) => r.priorityScore);
    expect(priorityScores).toEqual([18.6, 20.07, 12.0]);

    const priorities = result.map((r) => r.priority);
    expect(priorities).toEqual([2, 1, 3]);
  });
});