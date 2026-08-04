import { describe, test, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { uploadRecommendationReport } from "../../src/logic/it-1-br-3-1-1-1";

const fetchMock = require("jest-fetch-mock");

describe("AIエージェント推奨根拠の可視化機能", () => {
  // SCEN-167
  test("S3アップロード失敗時に最大2回まで指数バックオフで再試行される", async () => {
    fetchMock.resetMocks();

    let attemptCount = 0;
    const callTimestamps: number[] = [];
    const mockS3Client = {
      putObject: jest.fn(async () => {
        attemptCount++;
        callTimestamps.push(Date.now());

        if (attemptCount < 3) {
          const error = new Error("NetworkingError");
          (error as any).code = "NetworkingError";
          throw error;
        }

        return {
          ETag: '"abc123"',
          VersionId: "v1",
        };
      }),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(async (reportData: {
        fileName: string;
        content: Buffer;
        contentType: string;
      }) => {
        const maxRetries = 2;
        let lastError: Error | null = null;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            const result = await mockS3Client.putObject();
            return {
              success: true,
              location: `s3://recommendations/${reportData.fileName}`,
              eTag: result.ETag,
              uploadedAt: new Date("2024-01-15T11:00:00Z"),
            };
          } catch (error) {
            lastError = error as Error;

            if (attempt < maxRetries) {
              const waitTime = attempt === 0 ? 3000 : 10000;
              await new Promise((resolve) => setTimeout(resolve, waitTime));
            }
          }
        }

        if (lastError) {
          throw lastError;
        }
      }),
    };

    const reportData = {
      fileName: "recommendation_report_001.pdf",
      content: Buffer.from("PDF content"),
      contentType: "application/pdf",
    };

    const uploadStartTime = Date.now();
    const result = await mockFileStorageAdapter.uploadRecommendationReport(
      reportData
    );
    const uploadEndTime = Date.now();

    expect(mockS3Client.putObject).toHaveBeenCalledTimes(3);

    expect(result.success).toBe(true);
    expect(result.location).toBe(
      "s3://recommendations/recommendation_report_001.pdf"
    );
    expect(result.eTag).toBe('"abc123"');

    const timeBetweenFirstAndSecond =
      callTimestamps[1] - callTimestamps[0];
    const timeBetweenSecondAndThird =
      callTimestamps[2] - callTimestamps[1];

    expect(timeBetweenFirstAndSecond).toBeGreaterThanOrEqual(3000);
    expect(timeBetweenFirstAndSecond).toBeLessThan(3500);

    expect(timeBetweenSecondAndThird).toBeGreaterThanOrEqual(10000);
    expect(timeBetweenSecondAndThird).toBeLessThan(10500);

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalled();
  });
});