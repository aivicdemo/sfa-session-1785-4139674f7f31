import { analyzeProcessDeviationAndCorrelation } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業プロセス標準書との乖離分析と成約実績の相関分析", () => {
  // SCEN-864: [edge] 分析期間が1日のみの場合、その1日のデータで相関分析を実行する
  test("should execute correlation analysis with single day data and return analysis with correlation coefficient and data points", () => {
    const analysisRequest = {
      startDate: "2024-01-15",
      endDate: "2024-01-15",
      userRole: "営業管理者",
      salesActivityRecords: [
        {
          id: "activity_001",
          date: "2024-01-15",
          salesPersonId: "sp_001",
          processStep: "初回接触",
          activityType: "訪問",
          customerName: "顧客A",
        },
        {
          id: "activity_002",
          date: "2024-01-15",
          salesPersonId: "sp_001",
          processStep: "提案",
          activityType: "プレゼンテーション",
          customerName: "顧客A",
        },
        {
          id: "activity_003",
          date: "2024-01-15",
          salesPersonId: "sp_002",
          processStep: "初回接触",
          activityType: "電話",
          customerName: "顧客B",
        },
      ],
      contractResults: [
        {
          id: "contract_001",
          date: "2024-01-15",
          salesPersonId: "sp_001",
          customerId: "cust_001",
          contractAmount: 500000,
          completed: true,
        },
        {
          id: "contract_002",
          date: "2024-01-15",
          salesPersonId: "sp_002",
          customerId: "cust_002",
          contractAmount: 0,
          completed: false,
        },
      ],
      standardProcessDefinition: {
        stages: [
          { step: "初回接触", sequenceOrder: 1 },
          { step: "提案", sequenceOrder: 2 },
          { step: "交渉", sequenceOrder: 3 },
          { step: "成約", sequenceOrder: 4 },
        ],
      },
    };

    const result = analyzeProcessDeviationAndCorrelation(analysisRequest);

    expect(result.analysisDate).toBe("2024-01-15");
    expect(result.correlationCoefficient).toBe(0.500);
    expect(result.dataPointCount).toBe(2);
    expect(result.analysisMethod).toBe("ピアソン相関係数");
    expect(result.rootCauseAnalysis).toBeDefined();
    expect(result.rootCauseAnalysis.extractionCondition).toEqual({
      startDate: "2024-01-15",
      endDate: "2024-01-15",
    });
    expect(result.rootCauseAnalysis.targetRecordIds).toEqual([
      "activity_001",
      "activity_002",
      "contract_001",
    ]);
    expect(result.rootCauseAnalysis.calculationLogic).toBe(
      "営業プロセス標準書に基づく各ステップ完了度とその日の成約実績の相関を計算"
    );
    expect(result.analysisLog).toBeDefined();
    expect(result.analysisLog.sampleCount).toBe(2);
    expect(result.analysisLog.processedRecordCount).toBe(3);
    expect(result.analysisLog.usedSalesActivityDataCount).toBe(2);
    expect(result.analysisLog.timestamp).toBeDefined();
    expect(result.validationStatus).toEqual({
      isPeriodValid: true,
      periodCheckResult: "1日分の分析期間として妥当",
    });
  });
});