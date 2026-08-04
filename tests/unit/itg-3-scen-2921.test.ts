import { generateRecommendationWithFallback } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能 - S3失敗時のHTML代替表示", () => {
  test("SCEN-2921: Amazon S3連携 - uploadRecommendationReport呼び出しが失敗した場合、推奨内容がHTML形式で画面表示される", () => {
    // Arrange: AIRecommendationEngineからの推奨内容を取得
    const recommendationContent = {
      proposalApproach: "顧客の経営課題に対して、段階的なデジタル変革を提案。初期フェーズは業務プロセス診断、次フェーズでシステム導入支援。",
      reasoningExplanation: "類似顧客30社の成功事例から、同業種・規模での成功率が75%。提案タイミングは決算後3ヶ月以内が最適。",
      similarityScore: 82,
    };

    // FileStorageAdapterのアップロード失敗をシミュレート
    const fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn().mockRejectedValueOnce(
        new Error("S3_UPLOAD_FAILED")
      ),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // Act: uploadRecommendationReport呼び出しと代替処理を実行
    const htmlOutput = generateRecommendationWithFallback(
      recommendationContent,
      fileStorageAdapterStub
    );

    // Assert: ファイルストレージへのアップロード失敗を確認
    expect(fileStorageAdapterStub.uploadRecommendationReport).toHaveBeenCalled();

    // Assert: HTML形式の推奨内容が返却されていることを確認
    expect(htmlOutput).toContain("<html");
    expect(htmlOutput).toContain("</html>");

    // Assert: 推奨内容に提案アプローチが含まれていることを確認
    expect(htmlOutput).toContain(recommendationContent.proposalApproach);

    // Assert: 推奨内容に根拠説明が含まれていることを確認
    expect(htmlOutput).toContain(recommendationContent.reasoningExplanation);

    // Assert: 推奨内容に類似度スコアが含まれていることを確認
    expect(htmlOutput).toContain("82");

    // Assert: ブラウザ保存が可能な形式（proper HTML構造）であることを確認
    expect(htmlOutput).toContain("<head>");
    expect(htmlOutput).toContain("<body>");
    expect(htmlOutput).toContain("</head>");
    expect(htmlOutput).toContain("</body>");

    // Assert: S3へのファイルアップロードが実行されたが失敗したことを確認
    expect(fileStorageAdapterStub.uploadRecommendationReport).toHaveBeenCalledTimes(
      1
    );

    // Assert: generateDownloadUrlやdeleteExpiredReportsは呼ばれていないことを確認
    expect(fileStorageAdapterStub.generateDownloadUrl).not.toHaveBeenCalled();
    expect(fileStorageAdapterStub.deleteExpiredReports).not.toHaveBeenCalled();
  });
});