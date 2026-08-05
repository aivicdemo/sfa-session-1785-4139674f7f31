import { describe, it, expect, beforeEach } from "@jest/globals";
import { standardizeCustomerResponse } from "../../src/logic/it-1-br-2-1-1";

describe("顧客反応記録・標準化機能", () => {
  // SCEN-429
  it("顧客IDがnullのとき、エラーが発生する", () => {
    const input = {
      customerId: null,
      responseContent: "提案に対して前向きな返答をもらった",
      responseDateTime: new Date("2024-01-15T14:30:00Z"),
      responseType: "email",
    };

    expect(() => standardizeCustomerResponse(input)).toThrow(/顧客ID/);
  });
});