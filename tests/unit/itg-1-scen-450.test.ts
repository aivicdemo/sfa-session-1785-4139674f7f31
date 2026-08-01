import { describe, test, expect } from "@jest/globals";
import { analyzeSalesRepPerformance } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-450
  test("複数の異常パターンが同時に検出される場合、全ての異常が可視化される", () => {
    const salesRepId = "A001";
    const contractRatePercent = 45;
    const contractRateTarget = 90;
    const customerContactFrequency = 14;
    const customerContactFrequencyTarget = 20;
    const proposalMaterialLastUpdateDays = 102;
    const proposalMaterialUpdateThresholdDays = 90;

    const input = {
      salesRepId,
      contractRatePercent,
      contractRateTarget,
      customerContactFrequency,
      customerContactFrequencyTarget,
      proposalMaterialLastUpdateDays,
      proposalMaterialUpdateThresholdDays,
    };

    const result = analyzeSalesRepPerformance(input);

    expect(result.anomalies).toHaveLength(3);

    const contractRateAnomaly = result.anomalies.find(
      (a) => a.type === "contractRate"
    );
    expect(contractRateAnomaly).toBeDefined();
    expect(contractRateAnomaly?.actual).toBe(45);
    expect(contractRateAnomaly?.target).toBe(90);
    expect(contractRateAnomaly?.severity).toBe("red");

    const contactFrequencyAnomaly = result.anomalies.find(
      (a) => a.type === "contactFrequency"
    );
    expect(contactFrequencyAnomaly).toBeDefined();
    expect(contactFrequencyAnomaly?.actual).toBe(14);
    expect(contactFrequencyAnomaly?.target).toBe(20);
    expect(contactFrequencyAnomaly?.severity).toBe("red");

    const proposalUpdateAnomaly = result.anomalies.find(
      (a) => a.type === "proposalMaterialUpdate"
    );
    expect(proposalUpdateAnomaly).toBeDefined();
    expect(proposalUpdateAnomaly?.daysSinceLastUpdate).toBe(102);
    expect(proposalUpdateAnomaly?.severity).toBe("yellow");

    expect(result.anomalies.every((a) => a.isIndependent === true)).toBe(true);
  });
});