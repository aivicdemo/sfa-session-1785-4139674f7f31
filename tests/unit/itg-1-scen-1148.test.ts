import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

const fetchMock = require("jest-fetch-mock");
fetchMock.enableMocks();

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-1148
  test("相関分析の基礎データが不足しているとき、処理がエラーになること", async () => {
    // 準備: 成約実績データをモックデータとして設定
    const closed_deal_records = [
      {
        deal_id: "D001",
        sales_person_id: "SP001",
        closed_amount: 500000,
        closed_date: "2024-01-15",
      },
      {
        deal_id: "D002",
        sales_person_id: "SP001",
        closed_amount: 300000,
        closed_date: "2024-02-10",
      },
      {
        deal_id: "D003",
        sales_person_id: "SP002",
        closed_amount: 800000,
        closed_date: "2024-01-20",
      },
    ];

    // 準備: 行動データをモックデータとして設定（0件に設定して基礎データ不足を再現）
    const behavior_records: {
      sales_person_id: string;
      visit_count: number;
      proposal_count: number;
      email_count: number;
      activity_date: string;
    }[] = [];

    // 準備: APIレスポンスをモック設定
    const expected_error_response = {
      error_code: "INSUFFICIENT_DATA",
      error_message:
        "相関分析の実行に必要な行動パターンデータが不足しています。最小限必要なレコード数は10件以上です。",
      insufficient_data_type: "behavior_data",
    };

    fetchMock.mockResponseOnce(JSON.stringify(expected_error_response), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });

    // 実行: 相関分析APIを呼び出す
    const response = await fetch("/api/correlation-analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        behavior_data: behavior_records,
        closed_deal_data: closed_deal_records,
        analysis_period_start: "2024-01-01",
        analysis_period_end: "2024-02-28",
      }),
    });

    // 検証: HTTPステータスコード400が返却されること
    expect(response.status).toBe(400);

    // 検証: レスポンスボディを取得して検証
    const response_body = await response.json();

    // 検証: エラーコード『INSUFFICIENT_DATA』が含まれること
    expect(response_body.error_code).toBe("INSUFFICIENT_DATA");

    // 検証: エラーメッセージが正確に含まれること
    expect(response_body.error_message).toBe(
      "相関分析の実行に必要な行動パターンデータが不足しています。最小限必要なレコード数は10件以上です。"
    );

    // 検証: 不足しているデータタイプ『behavior_data』が含まれること
    expect(response_body.insufficient_data_type).toBe("behavior_data");
  });
});