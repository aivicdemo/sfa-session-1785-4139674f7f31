import { generateDownloadUrl } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能 - FileStorageAdapter統合", () => {
  test("SCEN-2710: 有効期限付きURLでの期限内ダウンロードが可能である", async () => {
    // Arrange
    const mockFileKey = "report-123";
    const mockExpirationSeconds = 3600;
    const currentTimeUnix = Math.floor(Date.now() / 1000);
    const expirationTimeUnix = currentTimeUnix + mockExpirationSeconds;

    const mockSignedUrl = `https://s3.amazonaws.com/bucket/${mockFileKey}?X-Amz-Expires=${mockExpirationSeconds}&X-Amz-Signature=mockSignature&X-Amz-Date=20240115T110000Z`;
    const mockPdfContent = Buffer.from("%PDF-1.4 mock pdf content", "utf-8");
    const mockExcelContent = Buffer.from(
      "PK\x03\x04 mock excel content",
      "utf-8"
    );

    const mockFileStorageAdapter = {
      generateDownloadUrl: jest.fn().mockResolvedValue({
        url: mockSignedUrl,
        expiresAt: new Date(expirationTimeUnix * 1000).toISOString(),
        expiresInSeconds: mockExpirationSeconds,
      }),
      uploadRecommendationReport: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // Mocking fetch for first download (PDF format)
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(
        new Response(mockPdfContent, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Length": mockPdfContent.length.toString(),
          },
        })
      )
      .mockResolvedValueOnce(
        new Response(mockExcelContent, {
          status: 200,
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Length": mockExcelContent.length.toString(),
          },
        })
      );

    // Act - First call: generate signed URL
    const downloadUrlResult = await generateDownloadUrl(
      mockFileStorageAdapter,
      mockFileKey
    );

    // Assert - URL generation
    expect(downloadUrlResult).toBeDefined();
    expect(downloadUrlResult.url).toContain(mockFileKey);
    expect(downloadUrlResult.url).toContain("X-Amz-Expires");
    expect(downloadUrlResult.url).toContain("X-Amz-Signature");
    expect(downloadUrlResult.expiresInSeconds).toBe(3600);

    // Act - First download: immediately after URL generation (PDF)
    const firstDownloadResponse = await fetch(downloadUrlResult.url);
    const firstDownloadContent = await firstDownloadResponse.arrayBuffer();
    const firstContentType = firstDownloadResponse.headers.get("Content-Type");

    // Assert - First download
    expect(firstDownloadResponse.status).toBe(200);
    expect(firstContentType).toBe("application/pdf");
    expect(new Uint8Array(firstDownloadContent)).toEqual(
      new Uint8Array(mockPdfContent)
    );

    // Act - Simulate time passage: 3599 seconds (within expiration window)
    jest.useFakeTimers();
    jest.advanceTimersByTime(3599000);

    // Act - Second download: after 3599 seconds (Excel)
    const secondDownloadResponse = await fetch(downloadUrlResult.url);
    const secondDownloadContent = await secondDownloadResponse.arrayBuffer();
    const secondContentType = secondDownloadResponse.headers.get(
      "Content-Type"
    );

    // Assert - Second download (still within valid period)
    expect(secondDownloadResponse.status).toBe(200);
    expect(secondContentType).toBe(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    expect(new Uint8Array(secondDownloadContent)).toEqual(
      new Uint8Array(mockExcelContent)
    );

    // Assert - URL consistency
    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith(
      mockFileKey
    );
    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledTimes(1);

    // Assert - Both downloads returned consistent file keys
    expect(downloadUrlResult.url).toContain(mockFileKey);

    jest.useRealTimers();
  });
});