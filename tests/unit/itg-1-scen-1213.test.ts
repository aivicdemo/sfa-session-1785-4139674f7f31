import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { analyzeCorrelationWithProcessCompliance } from "../../src/logic/it-1-br-2-1-1";

describe("Large-scale Sales Results Correlation Analysis", () => {
  it("SCEN-1213: should complete correlation analysis accurately with 500 sales result records", async () => {
    const testStartTime = new Date("2024-01-15T09:00:00Z");
    const testEndTime = new Date("2024-01-15T17:00:00Z");

    const salesResultRecords = generateTestSalesResults(500);
    const processDefinition = {
      steps: [
        { stepId: "step_1", name: "初期接触", sequence: 1 },
        { stepId: "step_2", name: "ニーズ把握", sequence: 2 },
        { stepId: "step_3", name: "提案", sequence: 3 },
        { stepId: "step_4", name: "交渉", sequence: 4 },
        { stepId: "step_5", name: "成約", sequence: 5 },
      ],
      totalSteps: 5,
    };

    const processComplianceData = generateProcessCompliance(
      salesResultRecords,
      processDefinition
    );

    const datasetHash = calculateDatasetHash(salesResultRecords);

    const result = analyzeCorrelationWithProcessCompliance(
      salesResultRecords,
      processDefinition,
      processComplianceData,
      {
        startTime: testStartTime,
        endTime: testEndTime,
        datasetHash: datasetHash,
      }
    );

    expect(result).toBeDefined();

    expect(result.processedRecordCount).toBe(500);
    expect(result.targetPeriodStart).toEqual(testStartTime);
    expect(result.targetPeriodEnd).toEqual(testEndTime);

    expect(Array.isArray(result.correlationCoefficients)).toBe(true);
    result.correlationCoefficients.forEach((coeff: number) => {
      expect(coeff).toBeGreaterThanOrEqual(-1.0);
      expect(coeff).toBeLessThanOrEqual(1.0);
    });

    expect(result.analysisMetadata).toBeDefined();
    expect(result.analysisMetadata.statisticalMethod).toBe("pearsonCorrelation");
    expect(result.analysisMetadata.correlationFormula).toBeDefined();
    expect(result.analysisMetadata.formulaDescription).toMatch(
      /Pearson correlation coefficient/i
    );
    expect(result.analysisMetadata.recordsProcessed).toBe(500);
    expect(result.analysisMetadata.datasetHashUsed).toBe(datasetHash);

    expect(Array.isArray(result.successPatterns)).toBe(true);
    expect(result.successPatterns.length).toBeGreaterThanOrEqual(3);

    result.successPatterns.forEach(
      (pattern: {
        id: string;
        description: string;
        leadTimeDaysAverage: number;
        contactCountMinimum: number;
        conversionRate: number;
        recordsMatching: number;
      }) => {
        expect(pattern.id).toBeDefined();
        expect(pattern.description).toMatch(/初期接触|接触回数|成約率/);
        expect(pattern.leadTimeDaysAverage).toBeGreaterThan(0);
        expect(pattern.leadTimeDaysAverage).toBeLessThanOrEqual(90);
        expect(pattern.contactCountMinimum).toBeGreaterThanOrEqual(1);
        expect(pattern.conversionRate).toBeGreaterThanOrEqual(0);
        expect(pattern.conversionRate).toBeLessThanOrEqual(100);
        expect(pattern.recordsMatching).toBeGreaterThanOrEqual(1);
        expect(pattern.recordsMatching).toBeLessThanOrEqual(500);
      }
    );

    const expectedSuccessPatternDescriptions = [
      "初期接触から成約まで平均15日以内、接触回数3回以上の場合の成約率72%",
      "ニーズ把握ステップ完全遵守、提案内容カテゴリB以上の成約率68%",
      "リードタイム20日以内、接触頻度週2回以上の成約率65%",
    ];

    expectedSuccessPatternDescriptions.forEach((expectedDesc: string) => {
      const matchingPattern = result.successPatterns.find(
        (p: { description: string }) => p.description.includes("平均15日")
          || p.description.includes("72%")
          || p.description.includes("68%")
          || p.description.includes("65%")
      );
      expect(matchingPattern).toBeDefined();
    });

    expect(result.auditLog).toBeDefined();
    expect(result.auditLog.processStartTime).toEqual(testStartTime);
    expect(result.auditLog.processEndTime).toBeDefined();
    const endTimeObj = new Date(result.auditLog.processEndTime);
    expect(endTimeObj.getTime()).toBeGreaterThanOrEqual(testStartTime.getTime());
    expect(result.auditLog.processedRecordCount).toBe(500);
    expect(result.auditLog.datasetHashValue).toBe(datasetHash);
    expect(result.auditLog.executionStatus).toBe("completed");
    expect(result.auditLog.statisticalMethod).toBe("pearsonCorrelation");

    expect(result.analysisRootData).toBeDefined();
    expect(result.analysisRootData.inputRecordsCount).toBe(500);
    expect(result.analysisRootData.processDefinitionVersion).toBeDefined();
    expect(result.analysisRootData.complianceDataRecordsCount).toBe(500);
    expect(Array.isArray(result.analysisRootData.correlationMatrixCells)).toBe(
      true
    );

    const correlationMatrixCells = result.analysisRootData
      .correlationMatrixCells as Array<{
      dimensionX: string;
      dimensionY: string;
      coefficient: number;
      sampleSize: number;
    }>;
    correlationMatrixCells.forEach((cell) => {
      expect(cell.dimensionX).toBeDefined();
      expect(cell.dimensionY).toBeDefined();
      expect(cell.coefficient).toBeGreaterThanOrEqual(-1.0);
      expect(cell.coefficient).toBeLessThanOrEqual(1.0);
      expect(cell.sampleSize).toBe(500);
    });
  });
});

function generateTestSalesResults(
  count: number
): Array<{
  salesResultId: string;
  salesPersonId: string;
  contractDate: Date;
  leadTimeDays: number;
  contactCount: number;
  proposalCategory: string;
  contracted: boolean;
}> {
  const results = [];
  for (let i = 0; i < count; i++) {
    const baseDate = new Date("2024-01-01T00:00:00Z");
    const contractDate = new Date(
      baseDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000
    );
    const leadTimeDays = Math.floor(Math.random() * 60) + 1;
    const contactCount = Math.floor(Math.random() * 8) + 1;
    const proposalCategories = ["A", "B", "C"];
    const proposalCategory =
      proposalCategories[Math.floor(Math.random() * proposalCategories.length)];

    const conversionThreshold =
      leadTimeDays <= 15 && contactCount >= 3
        ? 0.72
        : leadTimeDays <= 20 && contactCount >= 2
          ? 0.68
          : 0.45;
    const contracted = Math.random() < conversionThreshold;

    results.push({
      salesResultId: `result_${i + 1}`,
      salesPersonId: `person_${(i % 10) + 1}`,
      contractDate: contractDate,
      leadTimeDays: leadTimeDays,
      contactCount: contactCount,
      proposalCategory: proposalCategory,
      contracted: contracted,
    });
  }
  return results;
}

function generateProcessCompliance(
  salesResults: Array<{
    salesResultId: string;
    leadTimeDays: number;
    contactCount: number;
  }>,
  processDefinition: {
    steps: Array<{ stepId: string; sequence: number }>;
    totalSteps: number;
  }
): Array<{
  salesResultId: string;
  stepComplianceMap: Record<string, boolean>;
  processStepsCompleted: number;
  processStepsSkipped: number;
  complianceRate: number;
}> {
  return salesResults.map((result) => {
    const complianceMap: Record<string, boolean> = {};
    let completedSteps = 0;

    if (result.leadTimeDays <= 15) {
      processDefinition.steps.forEach((step) => {
        complianceMap[step.stepId] = true;
        completedSteps++;
      });
    } else {
      processDefinition.steps.forEach((step, index) => {
        const isCompliant = index < Math.ceil(result.contactCount);
        complianceMap[step.stepId] = isCompliant;
        if (isCompliant) completedSteps++;
      });
    }

    return {
      salesResultId: result.salesResultId,
      stepComplianceMap: complianceMap,
      processStepsCompleted: completedSteps,
      processStepsSkipped: processDefinition.totalSteps - completedSteps,
      complianceRate: (completedSteps / processDefinition.totalSteps) * 100,
    };
  });
}

function calculateDatasetHash(
  records: Array<{
    salesResultId: string;
  }>
): string {
  const hashInput = records
    .map((r) => r.salesResultId)
    .join("|");
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}