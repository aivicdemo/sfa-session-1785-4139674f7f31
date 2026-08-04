import { generateRecommendationReportWithFallback } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1703: レポート生成・出力機能 - ダウンロードURL生成が失敗したとき、エラーが発生する", () => {
    // テスト対象のレポート生成・出力機能を初期化するための入力データを準備
    const input_customer_id = "CUST-20240115-001";
    const input_deal_id = "DEAL-20240115-042";
    const input_recommendation_content = {
      approach: "顧客の既存システムとの統合を重視した段階的導入提案",
      timing: "Q2（4月-6月）",
      confidence_score: 82,
      key_factors: ["既存API連携実績", "導入期間短縮化", "ROI試算表"],
    };

    // AIRecommendationEngineのスタブを設定
    const ai_engine_stub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        customer_id: input_customer_id,
        deal_id: input_deal_id,
        recommendation: input_recommendation_content,
        reasoning: "過去の類似案件（DEAL-20231201-015）から抽出した成功パターン",
        success_pattern_id: "SP-20240101-0047",
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // FileStorageAdapterのスタブを設定：uploadRecommendationReportが成功してS3上のファイルキーを返すよう構成
    const upload_success_file_key = "s3://ai-recommendation-reports/DEAL-20240115-042-report-20240115T143022Z.pdf";
    const file_storage_stub_upload_success = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        file_key: upload_success_file_key,
        upload_timestamp: "2024-01-15T14:30:22Z",
        file_size_bytes: 245760,
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // FileStorageAdapterのスタブを設定：generateDownloadUrlがエラー（S3接続失敗）を発生させるよう構成
    const download_url_generation_error = new Error("S3 connection failed: Unable to reach S3 endpoint");
    const file_storage_stub_download_failure = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        file_key: upload_success_file_key,
        upload_timestamp: "2024-01-15T14:30:22Z",
        file_size_bytes: 245760,
      }),
      generateDownloadUrl: jest.fn().mockRejectedValue(download_url_generation_error),
      deleteExpiredReports: jest.fn(),
    };

    // レポート生成・出力機能を呼び出し、ダウンロードURLの生成処理を実行
    const result = generateRecommendationReportWithFallback(
      {
        customer_id: input_customer_id,
        deal_id: input_deal_id,
        recommendation: input_recommendation_content,
      },
      ai_engine_stub,
      file_storage_stub_download_failure
    );

    // 発生したエラーハンドリング結果を検証する
    // エラーオブジェクト（エラーコード、メッセージ）が発生すること
    expect(result).toHaveProperty("error");
    expect(result.error).toHaveProperty("code", "DOWNLOAD_URL_GENERATION_FAILED");
    expect(result.error).toHaveProperty("message");
    expect(result.error.message).toMatch(/レポート生成に失敗しました/);

    // 利用者向けメッセージが表示されること
    expect(result).toHaveProperty("user_message");
    expect(result.user_message).toBe(
      "レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください"
    );

    // 代替動作として、推奨内容がHTML形式で画面上に表示されること
    expect(result).toHaveProperty("fallback_html_content");
    expect(result.fallback_html_content).toBeTruthy();
    expect(typeof result.fallback_html_content).toBe("string");
    expect(result.fallback_html_content).toMatch(/<html/i);
    expect(result.fallback_html_content).toMatch(/顧客の既存システムとの統合を重視した段階的導入提案/);

    // ユーザーがブラウザの保存機能でファイルを取得可能な状態になること
    expect(result).toHaveProperty("fallback_download_enabled", true);
    expect(result).toHaveProperty("fallback_file_extension", "html");

    // エラーがスローされずに、graceful に処理されること
    expect(result).toHaveProperty("success", false);
  });
});