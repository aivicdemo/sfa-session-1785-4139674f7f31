import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import fetchMock from "jest-fetch-mock";
import {
  selectAnalysisIndicatorsForSalesRepresentative,
  generateBehaviorPatternAnalysisReport,
} from "../../src/logic/it-1-br-target4-1-1-1";

fetchMock.enableMocks();

describe("行動パターン分析対象指標の自動選定と分析レポート生成", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-773
  test("営業担当者ごとの行動パターン分析レポート生成時に自動選定された指標が使用される", async () => {
    // 営業担当者「田中太郎」のプロファイル情報を定義
    const salesRepresentativeProfile = {
      salesRepresentativeId: "SR001",
      name: "田中太郎",
      experienceYearsInSales: 3,
      assignedRegion: "関東",
      industrySpecialization: "IT",
    };

    // ステップ1: 行動パターン分析対象指標の自動選定機能を実行
    const selectedIndicators =
      await selectAnalysisIndicatorsForSalesRepresentative(
        salesRepresentativeProfile
      );

    // ステップ2: 自動選定された指標リストを確認
    // 経験年数3年、関東地域、IT業種に基づいて自動選定される指標
    const expectedSelectedIndicators = [
      "初回接触から案件化までの日数",
      "提案資料作成回数",
      "顧客訪問頻度",
    ];

    expect(selectedIndicators).toEqual(expectedSelectedIndicators);

    // ステップ3: モック保存用のデータを構築
    const mockSavedIndicators = {
      salesRepresentativeId: salesRepresentativeProfile.salesRepresentativeId,
      selectedIndicators: selectedIndicators,
      selectionTimestamp: "2024-01-15T11:00:00Z",
    };

    // モック保存が完了したことを想定
    fetchMock.mockResponseOnce(JSON.stringify(mockSavedIndicators), {
      status: 200,
    });

    // ステップ4: 「田中太郎」の営業活動データ（過去3ヶ月間）を定義
    const salesActivityData = {
      salesRepresentativeId: salesRepresentativeProfile.salesRepresentativeId,
      analysisStartDate: "2023-10-15",
      analysisEndDate: "2024-01-15",
      activityLogs: [
        {
          activityDate: "2023-10-20",
          activityType: "初回接触",
          customerId: "CUST001",
        },
        {
          activityDate: "2023-11-05",
          activityType: "提案資料作成",
          customerId: "CUST001",
        },
        {
          activityDate: "2023-11-10",
          activityType: "顧客訪問",
          customerId: "CUST001",
        },
        {
          activityDate: "2023-11-20",
          activityType: "初回接触",
          customerId: "CUST002",
        },
        {
          activityDate: "2023-12-01",
          activityType: "提案資料作成",
          customerId: "CUST002",
        },
        {
          activityDate: "2023-12-15",
          activityType: "顧客訪問",
          customerId: "CUST002",
        },
        {
          activityDate: "2024-01-05",
          activityType: "初回接触",
          customerId: "CUST003",
        },
        {
          activityDate: "2024-01-10",
          activityType: "提案資料作成",
          customerId: "CUST003",
        },
      ],
    };

    // ステップ5: 行動パターン分析レポート生成機能を実行
    const analysisReport = await generateBehaviorPatternAnalysisReport(
      salesActivityData,
      selectedIndicators
    );

    // ステップ6: 生成されたレポートで使用された指標を検証
    // 期待結果：レポートに含まれる分析指標が自動選定された指標と完全に一致
    expect(analysisReport.usedIndicators).toEqual(expectedSelectedIndicators);

    // ステップ7: レポート内の各指標について過去3ヶ月間のデータ値が正確に計算・表示されていることを検証
    expect(analysisReport.metrics).toEqual({
      初回接触から案件化までの日数: {
        averageDaysFromFirstContactToOpportunity: 26,
        dataPoints: [
          {
            customerId: "CUST001",
            daysFromFirstContact: 16,
          },
          {
            customerId: "CUST002",
            daysFromFirstContact: 41,
          },
          {
            customerId: "CUST003",
            daysFromFirstContact: 5,
          },
        ],
      },
      提案資料作成回数: {
        totalProposalDocumentCreations: 3,
        creationsPerMonth: {
          "2023-10": 1,
          "2023-11": 1,
          "2023-12": 1,
          "2024-01": 1,
        },
      },
      顧客訪問頻度: {
        totalCustomerVisits: 3,
        visitsPerMonth: {
          "2023-10": 1,
          "2023-11": 1,
          "2023-12": 1,
          "2024-01": 0,
        },
        averageVisitsPerMonth: 1.0,
      },
    });

    // ステップ8: レポートが正しくメタデータを保持していることを検証
    expect(analysisReport.salesRepresentativeId).toBe(
      salesRepresentativeProfile.salesRepresentativeId
    );
    expect(analysisReport.analysisStartDate).toBe("2023-10-15");
    expect(analysisReport.analysisEndDate).toBe("2024-01-15");
    expect(analysisReport.generationTimestamp).toBeDefined();
  });
});