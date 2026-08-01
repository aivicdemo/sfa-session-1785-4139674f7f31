import { describe, test, expect } from "@jest/globals";
import { validateLearningDataQuality } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-094: [error] AIエージェント推論実行前の学習データ量・品質検証機能 - 営業案件データが欠落している場合、学習データの品質検証に失敗する
  test("営業案件データから必須項目が欠落している場合、品質検証が失敗してステータスVALIDATION_FAILEDを返し、欠落内容を明記する", () => {
    const salesProjects = Array.from({ length: 100 }, (_, i) => ({
      projectId: `PRJ-${String(i + 1).padStart(3, "0")}`,
      projectName: `Project ${i + 1}`,
      amount: 1000000 + i * 10000,
      progressStatus: "NEGOTIATION",
    }));

    const incompleteProjects = salesProjects.map((proj, index) => {
      if (index < 20) {
        const incomplete: Record<string, string | number | undefined> = { ...proj };
        delete incomplete.projectId;
        delete incomplete.projectName;
        delete incomplete.amount;
        delete incomplete.progressStatus;
        return incomplete as {
          projectId?: string;
          projectName?: string;
          amount?: number;
          progressStatus?: string;
        };
      }
      return proj;
    });

    const result = validateLearningDataQuality(incompleteProjects);

    expect(result.validationStatus).toBe("VALIDATION_FAILED");
    expect(result.errorMessage).toMatch(/営業案件データの必須項目が20件のレコードで欠落/);
    expect(result.errorMessage).toMatch(/案件ID/);
    expect(result.errorMessage).toMatch(/案件名/);
    expect(result.errorMessage).toMatch(/金額/);
    expect(result.errorMessage).toMatch(/進捗ステータス/);
    expect(result.errorMessage).toMatch(/4項目すべてが必須/);
    expect(result.canExecuteInference).toBe(false);
  });
});