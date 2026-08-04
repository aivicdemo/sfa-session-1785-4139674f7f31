import { validateCustomerInputAndPrepareRecommendation } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-659: 商談予定日が本日以降のとき、入力受け付けが完了する", () => {
    // 現在日時を2026年8月1日12:00:00に固定
    const currentDate = new Date("2026-08-01T12:00:00Z");

    // 顧客情報の入力データを準備
    const customerInput = {
      customerName: "テスト株式会社",
      industry: "製造業",
      plannedMeetingDate: new Date("2026-08-01T00:00:00Z"),
    };

    // 検証関数を実行（引数：顧客情報、現在日時）
    const result = validateCustomerInputAndPrepareRecommendation(
      customerInput,
      currentDate
    );

    // 期待結果の検証
    // 1. 入力検証エラーが発生しないこと
    expect(result.isValid).toBe(true);

    // 2. エラーメッセージが存在しないこと
    expect(result.errors).toEqual([]);

    // 3. 顧客情報がシステムで受け付けられた状態（入力データが保持されている）
    expect(result.acceptedCustomerData).toEqual({
      customerName: "テスト株式会社",
      industry: "製造業",
      plannedMeetingDate: new Date("2026-08-01T00:00:00Z"),
    });

    // 4. 推奨生成処理への遷移準備が完了していること
    expect(result.readyForRecommendationGeneration).toBe(true);

    // 5. 入力検証チェックの結果詳細
    expect(result.validationDetails).toEqual({
      customerNameValid: true,
      industryValid: true,
      plannedMeetingDateValid: true,
      meetingDateIsNotInPast: true,
    });
  });
});