import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-399
  test("成功パターンマトリクス適用判定機能 - 営業担当者の過去実績データが存在しないとき適用判定が失敗する", async () => {
    const { evaluateSuccessPatternMatrixApplicability } = await import(
      "../../src/logic/it-1-br-2-1-1-1"
    );

    const nonExistentSalesPersonId = "SALES_PERSON_NOT_FOUND_12345";

    const result = evaluateSuccessPatternMatrixApplicability({
      salesPersonId: nonExistentSalesPersonId,
    });

    expect(result).toEqual({
      status: "失敗",
      errorCode: "NO_SALES_HISTORY",
      errorMessage: "該当営業担当者の過去実績データが見つかりません",
      applicablePatterns: null,
    });
    expect(result.errorCode).toBe("NO_SALES_HISTORY");
    expect(result.status).toBe("失敗");
    expect(result.applicablePatterns).toBeNull();
  });
});