import { describe, test, expect } from "@jest/globals";
import { validateRecommendationApproval } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2872
  test("推奨内容検証判定機能 - 承認可否の判定フラグが真偽値以外のとき、エラーを返す", () => {
    const invalidApprovalFlags = [
      "true",
      1,
      null,
      undefined,
      {},
      [],
    ];

    invalidApprovalFlags.forEach((invalidFlag) => {
      expect(() => {
        validateRecommendationApproval({
          approvalFlag: invalidFlag as any,
          recommendationId: "rec-001",
          recommendationContent: "提案内容サンプル",
        });
      }).toThrow(/承認可否の判定フラグ/);

      try {
        validateRecommendationApproval({
          approvalFlag: invalidFlag as any,
          recommendationId: "rec-001",
          recommendationContent: "提案内容サンプル",
        });
      } catch (error) {
        if (error instanceof Error) {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toMatch(/承認可否の判定フラグ/);
          expect((error as any).code).toBe("INVALID_APPROVAL_FLAG_TYPE");
          expect((error as any).statusCode).toBe(400);
          expect(error.stack).toMatch(/validateRecommendationApproval/);
        }
      }
    });
  });
});