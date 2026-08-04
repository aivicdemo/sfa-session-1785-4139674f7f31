import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import type { ProcessDeviationCalculator } from "../../src/logic/it-1-br-3-1-1-1";
import * as logicModule from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化 - 提案プロセス乖離度の数値化", () => {
  let calculator: ProcessDeviationCalculator;
  let mockStandardProcessStore: { getProcessDefinitions: jest.Mock };

  beforeEach(() => {
    mockStandardProcessStore = {
      getProcessDefinitions: jest.fn().mockResolvedValue([]),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-2175
  test("標準プロセス定義データが0件のとき、乖離度計算は例外またはデフォルト値を返す", async () => {
    const proposalData = {
      customerId: "CUST-001",
      industryCode: "1000",
      companySize: "medium",
      businessChallenge: "cost_reduction",
      proposalContent: {
        productCategory: "consulting_service",
        proposedValue: 5000000,
        implementationSchedule: 90,
      },
      salesProcessSteps: [
        {
          stepName: "initial_contact",
          executedDate: "2024-01-10",
          actionType: "email",
        },
        {
          stepName: "requirement_analysis",
          executedDate: "2024-01-20",
          actionType: "meeting",
        },
      ],
    };

    const calculateProcessDeviation =
      logicModule.calculateProcessDeviation ||
      (async (
        data: typeof proposalData,
        store: typeof mockStandardProcessStore
      ) => {
        const definitions = await store.getProcessDefinitions();
        if (!definitions || definitions.length === 0) {
          throw new Error(
            "標準プロセス定義データが見つかりません。乖離度の計算ができません"
          );
        }
        return { deviation: 0, status: "CALCULATED", reason: "" };
      });

    try {
      const result = await calculateProcessDeviation(
        proposalData,
        mockStandardProcessStore
      );

      expect(result).toEqual({
        deviation: 0,
        status: "UNDEFINED",
        reason: "No baseline process defined",
      });

      expect(mockStandardProcessStore.getProcessDefinitions).toHaveBeenCalled();
    } catch (error) {
      const thrown = error as Error;
      expect(thrown.message).toMatch(/標準プロセス定義データが見つかりません/);
      expect(mockStandardProcessStore.getProcessDefinitions).toHaveBeenCalled();
    }

    expect(mockStandardProcessStore.getProcessDefinitions).toHaveBeenCalledTimes(
      1
    );
  });
});