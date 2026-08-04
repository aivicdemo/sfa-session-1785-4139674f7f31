import { extractSuccessPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・重み付けロジック", () => {
  // SCEN-2788
  test("成約結果の区分が無効な値を含む場合、エラーを返す", () => {
    const invalidRecords = [
      {
        recordId: "REC001",
        customerId: "CUST001",
        dealStatus: "成功",
        contractOutcome: "成功",
        features: {
          industry: "IT",
          companySize: "medium",
          dealAmount: 5000000,
        },
      },
      {
        recordId: "REC002",
        customerId: "CUST002",
        dealStatus: "成功",
        contractOutcome: "失敗",
        features: {
          industry: "Manufacturing",
          companySize: "large",
          dealAmount: 3000000,
        },
      },
      {
        recordId: "REC003",
        customerId: "CUST003",
        dealStatus: "成功",
        contractOutcome: "保留中",
        features: {
          industry: "Finance",
          companySize: "small",
          dealAmount: 2000000,
        },
      },
    ];

    const callExtractSuccessPatterns = () => {
      extractSuccessPatterns(invalidRecords);
    };

    expect(callExtractSuccessPatterns).toThrow(/INVALID_CONTRACT_STATUS/);

    try {
      extractSuccessPatterns(invalidRecords);
    } catch (error: unknown) {
      const err = error as Record<string, unknown>;
      expect(err.errorCode).toBe("INVALID_CONTRACT_STATUS");
      expect(err.message).toMatch(/保留中/);
      expect(err.message).toMatch(/REC003/);
      expect(err.httpStatus).toBe(400);
    }
  });
});