import { validateCorrectedDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン - 修正済みデータの品質再検証", () => {
  // SCEN-439
  test("修正済みデータで複数回検証を実行した場合、毎回同じ判定結果が返される", () => {
    const correctedData = {
      customerId: "CUST-001",
      companyName: "株式会社テスト",
      phoneNumber: "09012345678",
    };

    const firstValidationResult = validateCorrectedDataQuality(correctedData);
    const secondValidationResult = validateCorrectedDataQuality(correctedData);
    const thirdValidationResult = validateCorrectedDataQuality(correctedData);

    expect(firstValidationResult.status).toBe("合格");
    expect(firstValidationResult.errorCode).toBe(0);
    expect(firstValidationResult.qualityScore).toBe(95);

    expect(secondValidationResult.status).toBe("合格");
    expect(secondValidationResult.errorCode).toBe(0);
    expect(secondValidationResult.qualityScore).toBe(95);

    expect(thirdValidationResult.status).toBe("合格");
    expect(thirdValidationResult.errorCode).toBe(0);
    expect(thirdValidationResult.qualityScore).toBe(95);

    expect(firstValidationResult).toEqual(secondValidationResult);
    expect(secondValidationResult).toEqual(thirdValidationResult);
    expect(firstValidationResult).toEqual(thirdValidationResult);
  });
});