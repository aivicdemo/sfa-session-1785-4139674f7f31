import { analyzeProcessDeviationAndCorrelation } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業プロセス標準書との乖離分析と成約実績の相関分析", () => {
  // SCEN-843
  test("ステップ実行度がちょうど0%の場合、相関係数を正確に計算する", () => {
    const processSteps = [
      { stepId: "step1", name: "初回接触" },
      { stepId: "step2", name: "提案" },
      { stepId: "step3", name: "交渉" },
      { stepId: "step4", name: "成約" },
      { stepId: "step5", name: "フォローアップ" },
    ];

    const targetCase = {
      caseId: "case_target_001",
      executedStepCount: 0,
      totalStepCount: 5,
      stepCompletionRate: 0.0,
      contracted: false,
    };

    const historicalCases = [
      { stepCompletionRate: 0.2, contracted: false },
      { stepCompletionRate: 0.4, contracted: false },
      { stepCompletionRate: 0.6, contracted: true },
      { stepCompletionRate: 0.8, contracted: true },
      { stepCompletionRate: 1.0, contracted: true },
      { stepCompletionRate: 0.3, contracted: false },
      { stepCompletionRate: 0.5, contracted: true },
      { stepCompletionRate: 0.7, contracted: true },
      { stepCompletionRate: 0.9, contracted: true },
      { stepCompletionRate: 0.1, contracted: false },
    ];

    const auditLog: {
      timestamp: string;
      operation: string;
      stepMean: number;
      contractedMean: number;
      stepVariance: number;
      contractedVariance: number;
      covariance: number;
      correlationCoefficient: number;
    }[] = [];

    const result = analyzeProcessDeviationAndCorrelation(
      processSteps,
      targetCase,
      historicalCases,
      auditLog
    );

    expect(result.correlationCoefficient).toBeGreaterThanOrEqual(-1.0);
    expect(result.correlationCoefficient).toBeLessThanOrEqual(1.0);
    expect(Number.isNaN(result.correlationCoefficient)).toBe(false);
    expect(Number.isFinite(result.correlationCoefficient)).toBe(true);

    expect(auditLog.length).toBeGreaterThan(0);
    const lastLog = auditLog[auditLog.length - 1];

    expect(lastLog.operation).toBe("correlation_calculation");
    expect(typeof lastLog.stepMean).toBe("number");
    expect(typeof lastLog.contractedMean).toBe("number");
    expect(typeof lastLog.stepVariance).toBe("number");
    expect(typeof lastLog.contractedVariance).toBe("number");
    expect(typeof lastLog.covariance).toBe("number");
    expect(lastLog.correlationCoefficient).toBe(result.correlationCoefficient);

    const expectedStepMean =
      (0.2 + 0.4 + 0.6 + 0.8 + 1.0 + 0.3 + 0.5 + 0.7 + 0.9 + 0.1) / 10;
    const expectedContractedMean =
      (0 + 0 + 1 + 1 + 1 + 0 + 1 + 1 + 1 + 0) / 10;

    expect(Math.abs(lastLog.stepMean - expectedStepMean)).toBeLessThan(0.0001);
    expect(Math.abs(lastLog.contractedMean - expectedContractedMean)).toBeLessThan(
      0.0001
    );

    expect(result.deviation).toBeDefined();
    expect(result.deviation.stepCompletionRate).toBe(0.0);
  });
});