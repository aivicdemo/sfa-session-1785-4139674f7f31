import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

const fetchMock = require("jest-fetch-mock");

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-241: [error] 乖離パターン分類機能 - 乖離パターン分類ルールの取得に失敗したときエラーになる
  test("should throw error when divergence pattern classification rule fetch fails with HTTP 500", async () => {
    const { fetchDivergencePatternClassificationRules } = await import(
      "../../src/logic/it-1-br-2-1-1-1"
    );

    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });

    let caughtError: any = null;

    try {
      await fetchDivergencePatternClassificationRules({
        ruleSetId: "rule-set-001",
        apiEndpoint: "https://api.example.com/divergence-rules",
      });
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError).not.toBeNull();
    expect(caughtError.errorCode).toBe("ERROR_DIVERGENCE_PATTERN_RULE_FETCH_FAILED");
    expect(caughtError.message).toMatch(/乖離パターン分類ルールの取得に失敗しました/);
    expect(caughtError.cause).toMatch(/HTTP 500/);
  });
});