import { applyNormalizationRules } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジンの構築", () => {
  // SCEN-221: [edge] 正規化ルール適用エンジン - 正規化ルール定義がないとき、適用処理がスキップされる
  test("正規化ルール定義がない場合、入力データは加工されず返される", () => {
    const inputCustomerData = {
      customer_id: "C001",
      customer_name: "山田　太郎",
      postal_code: "１２３-４５６７",
      phone_number: "０９０-１２３４-５６７８",
    };

    const normalizationRules = null;

    const result = applyNormalizationRules(inputCustomerData, normalizationRules);

    expect(result.customer_name).toBe("山田　太郎");
    expect(result.postal_code).toBe("１２３-４５６７");
    expect(result.phone_number).toBe("０９０-１２３４-５６７８");
    expect(result.customer_id).toBe("C001");
  });
});