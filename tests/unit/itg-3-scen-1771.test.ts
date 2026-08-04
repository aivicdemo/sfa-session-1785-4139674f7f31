import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1771
  test('根拠説明文に特殊文字を含むときHTMLエスケープして根拠表示内容を返す', () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        reasoning: "<script>alert('xss')</script> & \" ' test",
        confidence: 85,
        relatedPatterns: []
      })
    };

    const recommendationId = 'rec_12345';
    const customerId = 'cust_67890';

    const result = explainRecommendationReasoning(
      recommendationId,
      customerId,
      mockAIRecommendationEngine
    );

    const expectedEscapedReasoning = "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt; &amp; &quot; &#x27; test";

    expect(result).toEqual({
      reasoning: expectedEscapedReasoning,
      confidence: 85,
      relatedPatterns: [],
      isHtmlEscaped: true
    });

    expect(result.reasoning).toBe(expectedEscapedReasoning);
    expect(result.reasoning).not.toContain('<script>');
    expect(result.reasoning).not.toContain("alert('xss')");
    expect(result.reasoning).toContain('&lt;script&gt;');
    expect(result.reasoning).toContain('&lt;/script&gt;');
    expect(result.reasoning).toContain('&amp;');
    expect(result.reasoning).toContain('&#x27;');
    expect(result.reasoning).toContain('&quot;');

    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationId,
      customerId
    );
  });
});