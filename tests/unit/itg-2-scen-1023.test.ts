import { validateCustomerInteractionRecord } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-1023
  test("顧客対応記録のテキスト項目が指定文字数の上限を超える場合に形式検証エラーとして拒否される", () => {
    const exceededText = "a".repeat(501);
    const recordData = {
      remarks: exceededText,
    };

    const result = validateCustomerInteractionRecord(recordData);

    expect(result.status).toBe("error");
    expect(result.errorCode).toBe("TEXT_LENGTH_EXCEEDED");
    expect(result.errorMessage).toBe(
      "備考欄は500文字以内で入力してください（入力値：501文字）"
    );
    expect(result.errorField).toBe("remarks");
  });
});