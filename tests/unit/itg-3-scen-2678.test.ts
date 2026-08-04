import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化出力機能", () => {
  // SCEN-2678
  test("推奨根拠に特殊文字が含まれるとき、エスケープされて正しく出力される", () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        reasoning:
          '<script>alert("xss")</script>&nbsp;"quoted"\'apostrophe\'\n改行\t\tタブ',
        confidence: 85,
      }),
    };

    const result = explainRecommendationReasoning(
      {
        recommendationId: "rec-2024-001",
        customerId: "cust-12345",
        dealConditions: {
          industry: "IT",
          companySize: "large",
          budget: 5000000,
        },
      },
      mockAIEngine
    );

    expect(result.escapedReasoning).toContain("&lt;script&gt;");
    expect(result.escapedReasoning).toContain("&gt;");
    expect(result.escapedReasoning).toContain("&quot;xss&quot;");
    expect(result.escapedReasoning).toContain("&lt;/script&gt;");
    expect(result.escapedReasoning).toContain("&amp;nbsp;");
    expect(result.escapedReasoning).toContain("&quot;quoted&quot;");
    expect(result.escapedReasoning).toContain("&#39;apostrophe&#39;");

    expect(result.escapedReasoning).not.toContain("<script>");
    expect(result.escapedReasoning).not.toContain("</script>");
    expect(result.escapedReasoning).not.toContain('alert("xss")');

    const decoded = result.escapedReasoning
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&");

    expect(decoded).toContain("<script>alert");
    expect(decoded).toContain("quoted");
    expect(decoded).toContain("apostrophe");

    expect(result.confidence).toBe(85);
    expect(result.isEscaped).toBe(true);
  });
});