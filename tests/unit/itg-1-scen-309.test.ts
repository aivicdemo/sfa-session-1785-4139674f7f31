import { normalizeCustomerResponse } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-309
  test("[normal] 顧客反応記録・標準化機能 - 反応内容の標準化処理において前後の空白がトリムされる", () => {
    const input_response = "   顧客は製品に満足している  ";
    const result = normalizeCustomerResponse(input_response);
    expect(result).toBe("顧客は製品に満足している");
  });
});