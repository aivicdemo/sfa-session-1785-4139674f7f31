import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { runTx3Imp1Agent } from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  // SCEN-326: [error] システムヘルスチェック実行機能 - チェック対象システムリストが空のとき、エラーが発生する
  test("SCEN-326: チェック対象システムリストが空のとき、ValidationErrorが発生する", async () => {
    const emptySystemList: string[] = [];
    const diagnosisConfig = {
      systemList: emptySystemList,
      dataQualityThreshold: 0.95,
      inferenceAccuracyThreshold: 0.95,
      diagnosisTimestamp: new Date("2024-01-15T11:00:00Z"),
    };

    const executeHealthCheck = async () => {
      return runTx3Imp1Agent(diagnosisConfig);
    };

    try {
      await executeHealthCheck();
      expect.fail("Error should have been thrown");
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
      const err = error as Error & { statusCode?: number; errorType?: string };
      
      // (1) エラータイプが『ValidationError』または『EmptySystemListError』のいずれかである
      const isValidErrorType =
        err.errorType === "ValidationError" ||
        err.errorType === "EmptySystemListError" ||
        err.name === "ValidationError" ||
        err.name === "EmptySystemListError";
      expect(isValidErrorType).toBe(true);

      // (2) エラーメッセージに『チェック対象システムリストが空です』または『システムリストが未設定です』の文字列を含む
      const messageContainsExpectedText =
        /チェック対象システムリストが空です|システムリストが未設定です/.test(
          err.message
        );
      expect(messageContainsExpectedText).toBe(true);

      // (3) エラーオブジェクトのstatusCodeプロパティが400である
      expect(err.statusCode).toBe(400);
    }
  });
});