import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import type {
  RecommendationRationale,
  RationaleClassificationResult,
  AiRecommendationEngineStub,
} from "../../src/logic/it-1-br-3-1-1-1";
import { visualizeRecommendationRationale } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  let aiEngineStub: AiRecommendationEngineStub;

  beforeEach(() => {
    aiEngineStub = {
      extractRationaleByPeriod: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1760
  test("年度をまたぐ抽出期間で根拠を年度ごとに正しく分類する", () => {
    const previousFiscalYearStart = new Date("2023-12-01T00:00:00Z");
    const currentFiscalYearEnd = new Date("2024-03-31T23:59:59Z");

    const dealId = "DEAL-001";

    const previousFiscalYearRationales: RecommendationRationale[] = [
      {
        rationaleId: "RAT-001",
        dealId: dealId,
        occurrenceDate: new Date("2023-12-15T10:00:00Z"),
        rationaleType: "前年度成功パターン",
        fiscalYear: 2023,
        description: "顧客業種が製造業で規模が1000人以上の案件",
        confidenceScore: 85,
      },
      {
        rationaleId: "RAT-002",
        dealId: dealId,
        occurrenceDate: new Date("2024-01-20T14:30:00Z"),
        rationaleType: "前年度成功パターン",
        fiscalYear: 2023,
        description: "提案タイミングが予算決定期の案件",
        confidenceScore: 78,
      },
      {
        rationaleId: "RAT-003",
        dealId: dealId,
        occurrenceDate: new Date("2024-03-10T11:45:00Z"),
        rationaleType: "前年度成功パターン",
        fiscalYear: 2023,
        description: "営業担当者が3回以上フォローアップした案件",
        confidenceScore: 72,
      },
    ];

    const currentFiscalYearRationales: RecommendationRationale[] = [
      {
        rationaleId: "RAT-004",
        dealId: dealId,
        occurrenceDate: new Date("2024-04-05T09:15:00Z"),
        rationaleType: "当年度成功パターン",
        fiscalYear: 2024,
        description: "顧客が過去12ヶ月で3回以上購買した案件",
        confidenceScore: 92,
      },
    ];

    const allRationales = [
      ...previousFiscalYearRationales,
      ...currentFiscalYearRationales,
    ];

    (aiEngineStub.extractRationaleByPeriod as jest.Mock).mockReturnValue(
      allRationales
    );

    const result: RationaleClassificationResult =
      visualizeRecommendationRationale(
        dealId,
        previousFiscalYearStart,
        currentFiscalYearEnd,
        aiEngineStub
      );

    expect(result.classifiedRationales).toBeDefined();
    expect(result.classifiedRationales.length).toBe(2);

    const previousFiscalGroup = result.classifiedRationales[0];
    expect(previousFiscalGroup.fiscalYear).toBe(2023);
    expect(previousFiscalGroup.fiscalYearLabel).toBe("前年度成功パターン");
    expect(previousFiscalGroup.rationales.length).toBe(3);
    expect(previousFiscalGroup.rationales[0].rationaleId).toBe("RAT-001");
    expect(previousFiscalGroup.rationales[0].occurrenceDate).toEqual(
      new Date("2023-12-15T10:00:00Z")
    );
    expect(previousFiscalGroup.rationales[1].rationaleId).toBe("RAT-002");
    expect(previousFiscalGroup.rationales[1].occurrenceDate).toEqual(
      new Date("2024-01-20T14:30:00Z")
    );
    expect(previousFiscalGroup.rationales[2].rationaleId).toBe("RAT-003");
    expect(previousFiscalGroup.rationales[2].occurrenceDate).toEqual(
      new Date("2024-03-10T11:45:00Z")
    );

    const currentFiscalGroup = result.classifiedRationales[1];
    expect(currentFiscalGroup.fiscalYear).toBe(2024);
    expect(currentFiscalGroup.fiscalYearLabel).toBe("当年度成功パターン");
    expect(currentFiscalGroup.rationales.length).toBe(1);
    expect(currentFiscalGroup.rationales[0].rationaleId).toBe("RAT-004");
    expect(currentFiscalGroup.rationales[0].occurrenceDate).toEqual(
      new Date("2024-04-05T09:15:00Z")
    );

    expect(result.totalRationalesExtracted).toBe(4);
    expect(result.classificationCompletedAt).toBeDefined();

    const previousRationalesInOrder = previousFiscalGroup.rationales;
    expect(
      previousRationalesInOrder[0].occurrenceDate.getTime() <=
        previousRationalesInOrder[1].occurrenceDate.getTime()
    ).toBe(true);
    expect(
      previousRationalesInOrder[1].occurrenceDate.getTime() <=
        previousRationalesInOrder[2].occurrenceDate.getTime()
    ).toBe(true);

    for (const rationale of previousFiscalGroup.rationales) {
      expect(rationale.rationaleType).toBe("前年度成功パターン");
      expect(rationale.fiscalYear).toBe(2023);
      expect(rationale.confidenceScore).toBeGreaterThan(0);
      expect(rationale.confidenceScore).toBeLessThanOrEqual(100);
    }

    for (const rationale of currentFiscalGroup.rationales) {
      expect(rationale.rationaleType).toBe("当年度成功パターン");
      expect(rationale.fiscalYear).toBe(2024);
      expect(rationale.confidenceScore).toBeGreaterThan(0);
      expect(rationale.confidenceScore).toBeLessThanOrEqual(100);
    }

    expect(result.classifiedRationales[0].fiscalYear).toBeLessThan(
      result.classifiedRationales[1].fiscalYear
    );
  });
});