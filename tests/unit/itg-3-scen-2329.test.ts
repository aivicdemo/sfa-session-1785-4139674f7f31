import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { extractSuccessPatterns } from "../../src/logic/it-1-br-3-3-2-1";

const fetchMock = require("jest-fetch-mock");

describe("Success Pattern Extraction - Same Day Period", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-2329
  it("should extract only same-day deals when start and end dates are identical", async () => {
    const targetDate = "2026-01-15";
    const startDate = new Date("2026-01-15T00:00:00Z");
    const endDate = new Date("2026-01-15T23:59:59Z");

    const mockDealsBefore = [
      {
        dealId: "deal_001",
        dealDate: new Date("2026-01-14T10:00:00Z"),
        customerId: "cust_001",
        status: "success",
        revenue: 500000,
        approachPattern: "direct_contact",
      },
    ];

    const mockDealsTargetDay = [
      {
        dealId: "deal_002",
        dealDate: new Date("2026-01-15T09:00:00Z"),
        customerId: "cust_002",
        status: "success",
        revenue: 750000,
        approachPattern: "email_followup",
      },
      {
        dealId: "deal_003",
        dealDate: new Date("2026-01-15T11:30:00Z"),
        customerId: "cust_003",
        status: "success",
        revenue: 1000000,
        approachPattern: "meeting_proposal",
      },
      {
        dealId: "deal_004",
        dealDate: new Date("2026-01-15T14:15:00Z"),
        customerId: "cust_004",
        status: "success",
        revenue: 600000,
        approachPattern: "phone_call",
      },
    ];

    const mockDealsAfter = [
      {
        dealId: "deal_005",
        dealDate: new Date("2026-01-16T10:00:00Z"),
        customerId: "cust_005",
        status: "success",
        revenue: 450000,
        approachPattern: "direct_contact",
      },
      {
        dealId: "deal_006",
        dealDate: new Date("2026-01-16T13:45:00Z"),
        customerId: "cust_006",
        status: "success",
        revenue: 850000,
        approachPattern: "meeting_proposal",
      },
    ];

    const allMockDeals = [
      ...mockDealsBefore,
      ...mockDealsTargetDay,
      ...mockDealsAfter,
    ];

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest
        .fn()
        .mockResolvedValue({
          patterns: mockDealsTargetDay.map((deal) => ({
            dealId: deal.dealId,
            customerId: deal.customerId,
            dealDate: deal.dealDate.toISOString(),
            revenue: deal.revenue,
            approachPattern: deal.approachPattern,
            relevanceScore: 95,
          })),
          totalCount: 3,
        }),
    };

    const result = await extractSuccessPatterns(
      {
        startDate,
        endDate,
        statusFilter: "success",
        allDeals: allMockDeals,
      },
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        startDate: expect.any(Date),
        endDate: expect.any(Date),
        statusFilter: "success",
      })
    );

    const callArgs =
      mockAIRecommendationEngine.findSimilarPatterns.mock.calls[0][0];
    const callStartDate = new Date(callArgs.startDate);
    const callEndDate = new Date(callArgs.endDate);

    expect(callStartDate.toISOString().split("T")[0]).toBe("2026-01-15");
    expect(callEndDate.toISOString().split("T")[0]).toBe("2026-01-15");

    expect(result.patterns.length).toBe(3);

    result.patterns.forEach((pattern) => {
      const patternDate = new Date(pattern.dealDate)
        .toISOString()
        .split("T")[0];
      expect(patternDate).toBe("2026-01-15");
    });

    const patternDealIds = result.patterns.map((p) => p.dealId);
    expect(patternDealIds).toContain("deal_002");
    expect(patternDealIds).toContain("deal_003");
    expect(patternDealIds).toContain("deal_004");
    expect(patternDealIds).not.toContain("deal_001");
    expect(patternDealIds).not.toContain("deal_005");
    expect(patternDealIds).not.toContain("deal_006");

    expect(result.totalCount).toBe(3);
    expect(result.filteredDateRange).toEqual({
      startDate: "2026-01-15",
      endDate: "2026-01-15",
    });
  });
});