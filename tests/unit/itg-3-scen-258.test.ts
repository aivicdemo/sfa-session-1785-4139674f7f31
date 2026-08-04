import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { trackRecommendationResult } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨内容の結果追跡機能", () => {
  let aiEngineStub: jest.Mock;
  let fileStorageStub: jest.Mock;

  beforeEach(() => {
    aiEngineStub = jest.fn();
    fileStorageStub = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-258
  test("推奨履歴IDがnullのとき、結果追跡処理がエラーをスロー", () => {
    const recommendationHistoryId = null;

    expect(() => {
      trackRecommendationResult(
        recommendationHistoryId,
        aiEngineStub,
        fileStorageStub
      );
    }).toThrow(/推奨履歴ID/);

    expect(aiEngineStub).not.toHaveBeenCalled();
    expect(fileStorageStub).not.toHaveBeenCalled();
  });
});