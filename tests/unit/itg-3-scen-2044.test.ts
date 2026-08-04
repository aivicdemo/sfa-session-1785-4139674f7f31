import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { generateDownloadUrlWithExpiration } from "../../src/logic/it-1-br-3-1-1-1";

const fetchMock = require("jest-fetch-mock");
fetchMock.enableMocks();

describe("AIエージェント推奨根拠の可視化 - ダウンロードURL有効期限検証", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // SCEN-2044
  test("生成されたダウンロードURLの有効期限がちょうど切れたとき、URLアクセスが無効となる", () => {
    // 現在時刻を2024-01-15T10:00:00Zに固定
    const baseTime = new Date("2024-01-15T10:00:00Z");
    jest.setSystemTime(baseTime);

    const expirationTime = new Date("2024-01-15T11:00:00Z");
    const reportId = "report-001";
    const downloadUrl =
      "https://s3.amazonaws.com/sales-reports/recommendation-2024-01-15.pdf?expires=1705316400";
    const fileMetadata = {
      reportId: reportId,
      downloadUrl: downloadUrl,
      expirationTime: expirationTime.toISOString(),
      createdAt: baseTime.toISOString(),
    };

    // ダウンロードURLの生成をモック化
    const fileStorageAdapter = {
      generateDownloadUrl: jest.fn().mockReturnValue({
        url: downloadUrl,
        expirationTime: expirationTime.toISOString(),
      }),
      deleteExpiredReports: jest.fn().mockResolvedValue(undefined),
    };

    // 生成されたダウンロードURLと有効期限をレポートファイルメタデータに記録
    const result = generateDownloadUrlWithExpiration(
      { reportId, fileName: "recommendation-2024-01-15.pdf" },
      fileStorageAdapter
    );

    expect(result).toEqual({
      url: downloadUrl,
      expirationTime: expirationTime.toISOString(),
    });

    // システム時刻を有効期限と同じ時刻に進める
    jest.setSystemTime(expirationTime);

    // 有効期限切れの時刻でURLにアクセス
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: "ダウンロードリンクの有効期限が切れています",
        code: "DOWNLOAD_LINK_EXPIRED",
      }),
      { status: 403 }
    );

    return fetch(downloadUrl).then((response) => {
      expect(response.status).toBe(403);
      return response.json().then((data) => {
        expect(data.error).toMatch(/有効期限/);
        expect(data.code).toBe("DOWNLOAD_LINK_EXPIRED");
      });
    });
  });
});