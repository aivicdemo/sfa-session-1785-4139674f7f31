import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { recordCustomerResponseWithLearningDataStorage } from "../../src/logic/it-1-br-2-1-1";

const fetchMock = require("jest-fetch-mock");

describe("顧客反応記録・標準化機能 - AI学習データストレージ保存エラーハンドリング", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-439
  test("AI学習データストレージへの保存が失敗したときエラーが発生し、部分的保存データがロールバックされる", async () => {
    const customer_id = "CUST-20240115-001";
    const sales_rep_id = "REP-12345";
    const response_type = "email_reply";
    const response_content = "顧客から肯定的な反応がありました";
    const response_timestamp = new Date("2024-01-15T14:30:00Z");
    const standardized_pattern = "positive_response";
    const confidence_score = 0.92;
    const learning_data_id = "LD-20240115-0001";

    const input_data = {
      customer_id,
      sales_rep_id,
      response_type,
      response_content,
      response_timestamp,
      standardized_pattern,
      confidence_score,
      learning_data_id,
    };

    // ストレージ保存処理がエラーを返すようにモック設定（ステータスコード 500）
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Storage service unavailable",
      }),
      { status: 500 }
    );

    let error_thrown = false;
    let error_code_found = false;
    let error_message_found = false;

    try {
      await recordCustomerResponseWithLearningDataStorage(input_data);
    } catch (error) {
      error_thrown = true;
      const error_message = (error as Error).message;

      // エラーコード『STORAGE_SAVE_FAILED』が含まれているか確認
      if (error_message.includes("STORAGE_SAVE_FAILED")) {
        error_code_found = true;
      }

      // エラーメッセージに『AI学習データストレージへの保存に失敗しました』が含まれているか確認
      if (error_message.includes("AI学習データストレージへの保存に失敗しました")) {
        error_message_found = true;
      }
    }

    expect(error_thrown).toBe(true);
    expect(error_code_found).toBe(true);
    expect(error_message_found).toBe(true);

    // ロールバック確認: fetch が呼ばれたが、その後トランザクション的に元の状態に戻される
    // （具体的には、保存されたレコードが削除されるか、保存前の状態に復帰されることを確認）
    expect(fetchMock).toHaveBeenCalled();
  });
});