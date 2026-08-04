import { generateRecommendationReport } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-079
  test("同じ推奨内容で複数回レポート生成を実行しても同じ形式のファイルが生成される", () => {
    // テストデータ: 顧客情報と商談条件
    const customer_info = {
      customer_name: "A社",
      deal_amount: 5000000,
      industry: "製造業",
      challenge: "生産効率化",
    };

    const recommendation_content = {
      proposal_approach: "IoT導入による自動化提案",
      reasoning_basis: "過去成功事例との類似度スコア：0.92",
      confidence_score: 92,
    };

    // AIRecommendationEngineのスタブ
    const ai_engine_stub = {
      generateRecommendation: jest.fn().mockReturnValue({
        proposal_approach: recommendation_content.proposal_approach,
        reasoning_basis: recommendation_content.reasoning_basis,
        confidence_score: recommendation_content.confidence_score,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // FileStorageAdapterのスタブ
    const file_storage_stub = {
      uploadRecommendationReport: jest
        .fn()
        .mockImplementation((file_content: string, file_format: string) => {
          const timestamp = new Date("2024-06-15T10:00:00Z").toISOString();
          return {
            file_name: `recommendation_report_A_${timestamp.replace(/[:.]/g, "-")}.${file_format}`,
            file_size: file_content.length,
            file_format: file_format,
            timestamp: timestamp,
            page_count: 3,
            internal_structure: {
              header: "Recommendation Report - A社",
              sections: ["推奨内容", "根拠情報", "提案アプローチ"],
              font_size: 11,
              margin: "20mm",
              table_layout: "standard",
              caption_format: "番号付き",
            },
          };
        }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // 1回目のレポート生成
    const report_1 = generateRecommendationReport(
      customer_info,
      recommendation_content,
      ai_engine_stub,
      file_storage_stub
    );

    const metadata_1 = {
      file_format: report_1.file_format,
      file_size: report_1.file_size,
      page_count: report_1.page_count,
      internal_structure: report_1.internal_structure,
      timestamp: report_1.timestamp,
    };

    // 2回目のレポート生成
    const report_2 = generateRecommendationReport(
      customer_info,
      recommendation_content,
      ai_engine_stub,
      file_storage_stub
    );

    const metadata_2 = {
      file_format: report_2.file_format,
      file_size: report_2.file_size,
      page_count: report_2.page_count,
      internal_structure: report_2.internal_structure,
      timestamp: report_2.timestamp,
    };

    // 3回目のレポート生成
    const report_3 = generateRecommendationReport(
      customer_info,
      recommendation_content,
      ai_engine_stub,
      file_storage_stub
    );

    const metadata_3 = {
      file_format: report_3.file_format,
      file_size: report_3.file_size,
      page_count: report_3.page_count,
      internal_structure: report_3.internal_structure,
      timestamp: report_3.timestamp,
    };

    // ファイル形式の確認
    expect(metadata_1.file_format).toBe("pdf");
    expect(metadata_2.file_format).toBe("pdf");
    expect(metadata_3.file_format).toBe("pdf");

    // ファイルサイズの一致確認（±5%以内）
    const size_tolerance = metadata_1.file_size * 0.05;
    expect(Math.abs(metadata_2.file_size - metadata_1.file_size)).toBeLessThanOrEqual(
      size_tolerance
    );
    expect(Math.abs(metadata_3.file_size - metadata_1.file_size)).toBeLessThanOrEqual(
      size_tolerance
    );

    // ページ数の一致確認
    expect(metadata_1.page_count).toBe(3);
    expect(metadata_2.page_count).toBe(3);
    expect(metadata_3.page_count).toBe(3);

    // 内部構造の完全一致確認
    expect(metadata_2.internal_structure).toEqual(metadata_1.internal_structure);
    expect(metadata_3.internal_structure).toEqual(metadata_1.internal_structure);

    // 内部構造の詳細確認
    expect(metadata_1.internal_structure.header).toBe("Recommendation Report - A社");
    expect(metadata_1.internal_structure.sections).toEqual([
      "推奨内容",
      "根拠情報",
      "提案アプローチ",
    ]);
    expect(metadata_1.internal_structure.font_size).toBe(11);
    expect(metadata_1.internal_structure.margin).toBe("20mm");
    expect(metadata_1.internal_structure.table_layout).toBe("standard");
    expect(metadata_1.internal_structure.caption_format).toBe("番号付き");

    // 推奨内容の記述内容が完全一致
    expect(report_1.proposal_approach).toBe(recommendation_content.proposal_approach);
    expect(report_2.proposal_approach).toBe(recommendation_content.proposal_approach);
    expect(report_3.proposal_approach).toBe(recommendation_content.proposal_approach);

    expect(report_1.reasoning_basis).toBe(recommendation_content.reasoning_basis);
    expect(report_2.reasoning_basis).toBe(recommendation_content.reasoning_basis);
    expect(report_3.reasoning_basis).toBe(recommendation_content.reasoning_basis);

    // 生成日時以外のメタデータが同じ
    expect(report_1.file_name).not.toBe(report_2.file_name);
    expect(report_2.file_name).not.toBe(report_3.file_name);

    // AIエンジンが複数回呼び出されたことを確認
    expect(ai_engine_stub.generateRecommendation).toHaveBeenCalledTimes(3);

    // FileStorageが複数回呼び出されたことを確認
    expect(file_storage_stub.uploadRecommendationReport).toHaveBeenCalledTimes(3);
  });
});