import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { recordOperationLog, getOperationLogs } from "../../src/logic/it-1-br-3-3-2-1";

describe("AIエージェント推奨支援システム - 操作ログ記録と監査証跡", () => {
  let testUserId: string;
  let testStartTime: Date;
  let recommendationId: string;
  let dealId: string;
  let customerName: string;

  beforeEach(() => {
    testUserId = "user_12345";
    testStartTime = new Date("2024-01-15T10:00:00Z");
    recommendationId = "rec_001";
    dealId = "deal_001";
    customerName = "テスト顧客株式会社";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-941
  test("営業担当者の全操作が時系列で操作ログテーブルに記録される", () => {
    // (1) ログイン操作を記録
    const loginTimestamp = testStartTime;
    recordOperationLog({
      userId: testUserId,
      actionType: "LOGIN",
      timestamp: loginTimestamp,
      details: {},
    });

    // (2) 推奨依頼実行操作を記録
    const recommendationRequestTimestamp = new Date(
      "2024-01-15T10:05:00Z"
    );
    recordOperationLog({
      userId: testUserId,
      actionType: "RECOMMENDATION_REQUEST",
      timestamp: recommendationRequestTimestamp,
      details: {
        dealId: dealId,
        customerName: customerName,
      },
    });

    // (3) 根拠詳細表示操作を記録
    const viewReasoningTimestamp = new Date("2024-01-15T10:10:00Z");
    recordOperationLog({
      userId: testUserId,
      actionType: "VIEW_REASONING",
      timestamp: viewReasoningTimestamp,
      details: {
        recommendationId: recommendationId,
      },
    });

    // (4) 提案資料生成操作を記録
    const generateReportTimestamp = new Date("2024-01-15T10:15:00Z");
    recordOperationLog({
      userId: testUserId,
      actionType: "GENERATE_REPORT",
      timestamp: generateReportTimestamp,
      details: {
        recommendationId: recommendationId,
        format: "PDF",
      },
    });

    // (5) 推奨確定操作を記録
    const confirmRecommendationTimestamp = new Date(
      "2024-01-15T10:20:00Z"
    );
    recordOperationLog({
      userId: testUserId,
      actionType: "CONFIRM_RECOMMENDATION",
      timestamp: confirmRecommendationTimestamp,
      details: {
        recommendationId: recommendationId,
      },
    });

    // 操作ログを取得して検証
    const operationLogs = getOperationLogs({
      userId: testUserId,
      startDate: testStartTime,
      endDate: new Date("2024-01-15T10:30:00Z"),
    });

    // 5件のレコードが記録されていることを確認
    expect(operationLogs).toHaveLength(5);

    // (1) ログイン操作の検証
    expect(operationLogs[0]).toEqual({
      userId: testUserId,
      actionType: "LOGIN",
      timestamp: loginTimestamp,
      details: {},
    });

    // (2) 推奨依頼実行操作の検証
    expect(operationLogs[1]).toEqual({
      userId: testUserId,
      actionType: "RECOMMENDATION_REQUEST",
      timestamp: recommendationRequestTimestamp,
      details: {
        dealId: dealId,
        customerName: customerName,
      },
    });

    // (3) 根拠詳細表示操作の検証
    expect(operationLogs[2]).toEqual({
      userId: testUserId,
      actionType: "VIEW_REASONING",
      timestamp: viewReasoningTimestamp,
      details: {
        recommendationId: recommendationId,
      },
    });

    // (4) 提案資料生成操作の検証
    expect(operationLogs[3]).toEqual({
      userId: testUserId,
      actionType: "GENERATE_REPORT",
      timestamp: generateReportTimestamp,
      details: {
        recommendationId: recommendationId,
        format: "PDF",
      },
    });

    // (5) 推奨確定操作の検証
    expect(operationLogs[4]).toEqual({
      userId: testUserId,
      actionType: "CONFIRM_RECOMMENDATION",
      timestamp: confirmRecommendationTimestamp,
      details: {
        recommendationId: recommendationId,
      },
    });

    // 時系列順序の検証
    for (let i = 0; i < operationLogs.length - 1; i++) {
      expect(
        operationLogs[i].timestamp.getTime() <=
          operationLogs[i + 1].timestamp.getTime()
      ).toBe(true);
    }

    // user_idの一貫性を検証
    operationLogs.forEach((log) => {
      expect(log.userId).toBe(testUserId);
    });
  });
});