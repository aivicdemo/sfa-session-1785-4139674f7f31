import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import fetchMock from "jest-fetch-mock";
import { validateSalesDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-412
  test("入力顧客情報が正規化ルール定義を参照できない場合、検証エラーが発生する", () => {
    const customer_name = "山田太郎";
    const email = "yamada@example.com";
    const phone = "09012345678";

    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 404 });

    expect(() => {
      validateSalesDataQuality({
        customer_name,
        email,
        phone,
      });
    }).toThrow(/RULE_DEFINITION_NOT_FOUND/);
  });
});