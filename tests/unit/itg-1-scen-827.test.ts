import { analyzeSalespersonBehaviorPattern } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-827
  test("分析対象となる営業担当者が存在しない場合、該当者なしエラーを発生させる", () => {
    const nonExistentSalespersonId = 99999;
    const analysisStartDate = "2024-01-01T00:00:00Z";
    const analysisEndDate = "2024-01-31T23:59:59Z";

    const result = analyzeSalespersonBehaviorPattern({
      salespersonId: nonExistentSalespersonId,
      analysisStartDate,
      analysisEndDate,
    });

    expect(result.errorCode).toBe("ERR_SALESPERSON_NOT_FOUND");
    expect(result.httpStatus).toBe(404);
    expect(result.errorMessage).toBe("指定された営業担当者が見つかりません");
    expect(result.isSuccess).toBe(false);
  });
});