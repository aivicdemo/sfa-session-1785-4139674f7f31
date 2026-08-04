import { generateRecommendationReport } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-2487: Amazon S3へのアップロード失敗時、推奨内容がHTML形式で画面表示される", async () => {
    // Setup: AIRecommendationEngine スタブ
    const ai_recommendation_engine_stub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_approach:
          "顧客の予算規模に基づき、段階的な導入アプローチを推奨",
        confidence_score: 85,
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning_explanation:
          "過去3年間の類似案件（同業種・同規模・同予算帯）の成功パターンとの一致度が85%であることが根拠です。特に初期導入段階での顧客課題への対応実績が高いため、本案件にも適用可能と判定しました。",
      }),
    };

    // Setup: FileStorageAdapter スタブ - アップロード失敗を2回返した後も失敗
    let upload_attempt_count = 0;
    const file_storage_adapter_stub = {
      uploadRecommendationReport: jest.fn().mockImplementation(() => {
        upload_attempt_count++;
        return Promise.reject(new Error("S3 upload failed"));
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // 入力: 商談条件
    const input_deal_conditions = {
      customer_name: "テストカンパニーA",
      product_category: "企業向けSaaS",
      budget_scale: 5000000,
      industry: "金融",
      company_size: "従業員1000名以上",
      deal_stage: "初期検討",
    };

    // 実行: 推奨レポート生成
    const html_report_result = await generateRecommendationReport(
      input_deal_conditions,
      ai_recommendation_engine_stub,
      file_storage_adapter_stub
    );

    // 検証: S3アップロード失敗時のリトライロジック
    expect(upload_attempt_count).toBe(2);

    // 検証: HTML形式でのフォールバック表示
    expect(html_report_result).toHaveProperty("is_fallback_html", true);
    expect(html_report_result).toHaveProperty("html_content");

    // 検証: HTMLコンテンツが存在し、推奨内容が含まれる
    const html_content = html_report_result.html_content;
    expect(html_content).toContain("<div");
    expect(html_content).toContain("</div>");
    expect(html_content).toMatch(
      /顧客の予算規模に基づき、段階的な導入アプローチを推奨/
    );

    // 検証: 推奨スコアがHTML内に表示される
    expect(html_content).toContain("85");

    // 検証: 根拠説明がHTML内に含まれる
    expect(html_content).toMatch(/過去3年間の類似案件/);
    expect(html_content).toMatch(/成功パターンとの一致度が85%/);

    // 検証: 営業担当者向け説明文がHTML内に含まれる
    expect(html_content).toMatch(/初期導入段階での顧客課題への対応実績/);

    // 検証: HTMLテーブルまたはリスト構造が含まれる
    expect(html_content).toMatch(/(<table|<ul|<ol|<li)/);

    // 検証: 営業担当者が入力した条件がHTML内に反映される
    expect(html_content).toContain("テストカンパニーA");
    expect(html_content).toContain("企業向けSaaS");
    expect(html_content).toContain("5000000");

    // 検証: AIエージェント生成内容が HTML 内に正しく含まれる
    expect(html_report_result).toHaveProperty("recommendation_approach");
    expect(html_report_result.recommendation_approach).toBe(
      "顧客の予算規模に基づき、段階的な導入アプローチを推奨"
    );
    expect(html_report_result).toHaveProperty("confidence_score", 85);
    expect(html_report_result).toHaveProperty("reasoning_explanation");

    // 検証: HTMLコンテンツが ブラウザで保存可能な形式
    expect(html_content).toContain("<!DOCTYPE") || html_content.startsWith("<");
    expect(html_content.length).toBeGreaterThan(100);
  });
});