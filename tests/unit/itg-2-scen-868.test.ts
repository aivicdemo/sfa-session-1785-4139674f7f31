import { it, describe, expect, beforeEach, afterEach } from "@jest/globals";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-868
  it("正規化ルールが0件のとき、正規化は実行されない", async () => {
    const fetchMock = require("jest-fetch-mock");
    fetchMock.enableMocks();

    beforeEach(() => {
      fetchMock.resetMocks();
    });

    afterEach(() => {
      fetchMock.disableMocks();
    });

    const { normalizeCustomerData } = await import(
      "../../src/logic/it-1-br-2-2-1-1"
    );

    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify([]), { status: 200 });

    const inputCustomerData = {
      customerId: "C001",
      name: "田中 太郎",
      phoneNumber: "090-1234-5678",
    };

    const result = await normalizeCustomerData(inputCustomerData);

    expect(fetchMock.mock.calls.length).toBe(1);
    expect(result).toEqual({
      customerId: "C001",
      name: "田中 太郎",
      phoneNumber: "090-1234-5678",
    });
  });
});