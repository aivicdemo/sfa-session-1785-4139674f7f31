import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("営業プロセス標準書のシステム要件変換機能", () => {
  test("SCEN-208: 複数の段階が同じ判定基準を持つとき、同値データとして統合される", () => {
    // Arrange: テスト用の段階定義と判定基準を準備
    const stage_a = {
      stageId: "STAGE_A",
      stageName: "段階A",
      judgmentCriteria: {
        minimumRevenue: 1000000,
        minimumContractMonths: 12,
      },
    };

    const stage_b = {
      stageId: "STAGE_B",
      stageName: "段階B",
      judgmentCriteria: {
        minimumRevenue: 1000000,
        minimumContractMonths: 12,
      },
    };

    const stage_c = {
      stageId: "STAGE_C",
      stageName: "段階C",
      judgmentCriteria: {
        minimumRevenue: 1000000,
        minimumContractMonths: 12,
      },
    };

    const stages = [stage_a, stage_b, stage_c];

    // Import の対象関数を呼び出す
    const { convertProcessStandardToSystemRequirements } = require(
      "../../src/logic/it-1-br-2-1-1"
    );

    // Act: システム要件変換を実行
    const result = convertProcessStandardToSystemRequirements({
      stages: stages,
    });

    // Assert: 同値グループが統合されていることを検証
    expect(result).toBeDefined();
    expect(result.equivalenceGroups).toBeDefined();
    expect(result.equivalenceGroups.length).toBe(1);

    const equivalenceGroup = result.equivalenceGroups[0];
    expect(equivalenceGroup.groupId).toBe("EQ-001");
    expect(equivalenceGroup.judgmentCriteria).toEqual({
      minimumRevenue: 1000000,
      minimumContractMonths: 12,
    });

    // 統合前の段階参照が削除され、統一されたグループのみが存在することを検証
    expect(equivalenceGroup.originalStageIds).toEqual([
      "STAGE_A",
      "STAGE_B",
      "STAGE_C",
    ]);
    expect(equivalenceGroup.unifiedRequirementId).toBe("REQ-EQ-001");

    // システム要件テーブルに統合後のグループのみが記録されていることを検証
    const systemRequirements = result.systemRequirements;
    expect(systemRequirements).toBeDefined();
    expect(systemRequirements.length).toBe(1);
    expect(systemRequirements[0].requirementId).toBe("REQ-EQ-001");
    expect(systemRequirements[0].criteria).toEqual({
      minimumRevenue: 1000000,
      minimumContractMonths: 12,
    });

    // 元の3段階への個別参照が存在しないことを確認
    const individualRequirements = systemRequirements.filter((req: any) =>
      ["REQ-STAGE_A", "REQ-STAGE_B", "REQ-STAGE_C"].includes(req.requirementId)
    );
    expect(individualRequirements.length).toBe(0);
  });
});