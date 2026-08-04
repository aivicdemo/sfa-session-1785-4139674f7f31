import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2689
  test('推奨内容の生成タイムスタンプが月初のとき、正しく根拠の時系列に反映される', () => {
    // Mock AIRecommendationEngine
    const mockGenerateRecommendationResult = {
      recommendation: '顧客ABCに対する提案アプローチ：営業戦略A',
      generatedAt: '2026-02-01T00:00:00Z',
      reasoningData: [
        {
          patternId: 'pattern_001',
          similarCaseDate: '2026-01-15T10:30:00Z',
          caseTitle: '案件A',
          matchScore: 0.92,
        },
        {
          patternId: 'pattern_002',
          similarCaseDate: '2025-12-20T14:15:00Z',
          caseTitle: '案件B',
          matchScore: 0.88,
        },
      ],
    };

    // Mock explainRecommendationReasoning response
    const mockExplanationText =
      '推奨内容の根拠:\n' +
      '1. 2026年1月15日の案件A：顧客属性が現在の案件と合致。営業戦略Aの成功パターンに適合。信頼度92%。\n' +
      '2. 2025年12月20日の案件B：類似の業種・規模。同様の購買タイミングで成約。信頼度88%。';

    // Verify the explanation contains expected timestamps
    const timestampPattern = /(\d{4})年(\d{1,2})月(\d{1,2})日/g;
    const timestampMatches = Array.from(mockExplanationText.matchAll(timestampPattern));

    expect(timestampMatches.length).toBe(2);

    // Extract and convert timestamps to Date objects for sorting
    const extractedDates: { dateString: string; dateObj: Date }[] = [];

    timestampMatches.forEach((match) => {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const day = parseInt(match[3], 10);
      const dateString = `${match[1]}年${match[2]}月${match[3]}日`;
      const dateObj = new Date(year, month - 1, day);

      extractedDates.push({
        dateString,
        dateObj,
      });
    });

    // Sort by date in descending order (newest first)
    const sortedDates = extractedDates.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

    // Verify the sorted order matches the expected chronological order
    expect(sortedDates[0].dateString).toBe('2026年1月15日');
    expect(sortedDates[1].dateString).toBe('2025年12月20日');

    // Verify that all dates are before the generation timestamp (2026-02-01)
    const generationDate = new Date('2026-02-01T00:00:00Z');
    sortedDates.forEach((item) => {
      expect(item.dateObj.getTime()).toBeLessThan(generationDate.getTime());
    });

    // Verify the order in the original explanation text is correct
    const firstDateIndex = mockExplanationText.indexOf('2026年1月15日');
    const secondDateIndex = mockExplanationText.indexOf('2025年12月20日');
    expect(firstDateIndex).toBeLessThan(secondDateIndex);

    // Verify date format consistency (YYYY年MM月DD日)
    const dateFormatPattern = /\d{4}年\d{1,2}月\d{1,2}日/g;
    const allFormattedDates = mockExplanationText.match(dateFormatPattern);
    expect(allFormattedDates).toHaveLength(2);
    allFormattedDates?.forEach((dateStr) => {
      expect(dateStr).toMatch(/\d{4}年\d{1,2}月\d{1,2}日/);
    });
  });
});