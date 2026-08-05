import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { generateSalesProcessExecutionReport } from "../../src/logic/it-1-br-target4-1-1-1";

const fetchMock = require("jest-fetch-mock");

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-1118
  test("営業プロセス実行状況データが存在しないとき、DATA_NOT_FOUNDエラーが返却される", async () => {
    const sales_person_id = "USER001";

    fetchMock.mockResponseOnce(JSON.stringify([]), { status: 200 });

    let caught_error: any = null;
    try {
      await generateSalesProcessExecutionReport({
        sales_person_id: sales_person_id,
      });
    } catch (error) {
      caught_error = error;
    }

    expect(caught_error).toBeDefined();
    expect(caught_error.error_code).toBe("DATA_NOT_FOUND");
    expect(caught_error.message).toMatch(/営業プロセス実行状況データが見つかりません/);
  });
});