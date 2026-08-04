import { generateAndUploadRecommendationReport } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨支援システム - 推奨根拠の可視化機能", () => {
  test("SCEN-814: [normal] ファイルストレージ連携（正常系） - 推奨報告レポートがPDF形式で正常にアップロードされる", async () => {
    // テスト日時を固定値として定義
    const uploadTimestamp = new Date("2024-01-15T10:30:00Z");
    const expectedExpiryDate = new Date("2024-02-14T10:30:00Z"); // 30日後

    // AIRecommendationEngineのスタブ定義
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationText:
          "顧客の業種・規模から推奨提案内容: クラウド型経営管理システムの導入を推奨",
        confidenceScore: 85,
        reasoningExplanation:
          "過去の類似案件（業種: 製造業、規模: 従業員500名）との一致度92%。成功率87%の成功パターンマッチ",
      }),
    };

    // FileStorageAdapterのスタブ定義
    const fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        s3ObjectKey: "recommendations/recommendation_2024-01-15T10-30-00Z.pdf",
        uploadedAt: uploadTimestamp,
        status: "uploaded",
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        downloadUrl:
          "https://s3.amazonaws.com/signed-url?token=abc123&expires=2024-02-14",
        expiresAt: expectedExpiryDate,
      }),
    };

    // テスト対象の入力データ
    const inputRequest = {
      customerId: "CUST_20240115_001",
      customerName: "ABC Manufacturing Co., Ltd.",
      industry: "製造業",
      employeeCount: 500,
      businessChallenge: "生産効率の向上と在庫管理の最適化",
      dealConditions: {
        proposedProductCategory: "クラウド型経営管理システム",
        estimatedBudget: 5000000,
        expectedImplementationDate: "2024-06-30",
      },
    };

    // 関数を実行
    const result = await generateAndUploadRecommendationReport(
      inputRequest,
      aiRecommendationEngineStub,
      fileStorageAdapterStub
    );

    // AIRecommendationEngineが呼び出されたことを検証
    expect(aiRecommendationEngineStub.generateRecommendation).toHaveBeenCalledWith(
      inputRequest
    );

    // FileStorageAdapterのuploadRecommendationReportが呼び出されたことを検証
    expect(
      fileStorageAdapterStub.uploadRecommendationReport
    ).toHaveBeenCalled();

    // FileStorageAdapterのuploadRecommendationReportの呼び出し時に渡されたレポート内容を検証
    const uploadCallArgs =
      fileStorageAdapterStub.uploadRecommendationReport.mock.calls[0][0];
    expect(uploadCallArgs.recommendationText).toContain(
      "クラウド型経営管理システムの導入を推奨"
    );
    expect(uploadCallArgs.confidenceScore).toBe(85);

    // FileStorageAdapterのgeneratDownloadUrlが呼び出されたことを検証
    expect(fileStorageAdapterStub.generateDownloadUrl).toHaveBeenCalled();

    // 結果の検証：ファイル名がPDF形式で日時を含むこと
    expect(result.reportFileName).toMatch(
      /^recommendation_\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}Z\.pdf$/
    );

    // S3オブジェクトキーが正しく設定されていることを検証
    expect(result.s3ObjectKey).toBe(
      "recommendations/recommendation_2024-01-15T10-30-00Z.pdf"
    );

    // アップロード完了日時が正しく設定されていることを検証
    expect(result.uploadedAt).toEqual(uploadTimestamp);

    // 有効期限が30日後であることを検証
    const expiryDiffMs =
      result.expiryDate.getTime() - result.uploadedAt.getTime();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    expect(expiryDiffMs).toBe(thirtyDaysMs);

    // ステータスが'uploaded'であることを検証
    expect(result.status).toBe("uploaded");

    // ダウンロードURLが生成されていることを検証
    expect(result.downloadUrl).toBe(
      "https://s3.amazonaws.com/signed-url?token=abc123&expires=2024-02-14"
    );

    // ダウンロードURL有効期限が正しく設定されていることを検証
    expect(result.downloadUrlExpiresAt).toEqual(expectedExpiryDate);

    // 成功メッセージが含まれていることを検証
    expect(result.userMessage).toContain("推奨報告レポートがPDF形式で");
    expect(result.userMessage).toContain("正常に生成・保存されました");

    // レポートメタデータが正しく設定されていることを検証
    expect(result.reportMetadata).toEqual({
      fileName: result.reportFileName,
      s3ObjectKey: result.s3ObjectKey,
      uploadedAt: uploadTimestamp,
      expiryDate: expectedExpiryDate,
      status: "uploaded",
    });
  });
});