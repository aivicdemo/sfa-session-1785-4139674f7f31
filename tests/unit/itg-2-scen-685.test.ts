import { visualizeRecommendationBasis } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-685: [edge] 推奨内容根拠の可視化機能 - 過去事例が月初の日付のとき、正しく時系列ソートされる
  test('should sort past cases by date in ascending order, maintaining stable order for same-date cases', () => {
    const pastCases = [
      {
        id: 'case_A',
        date: new Date('2024-01-01T00:00:00Z'),
        recommendationScore: 85,
        description: 'Case A - January 1st',
      },
      {
        id: 'case_B',
        date: new Date('2024-01-15T00:00:00Z'),
        recommendationScore: 90,
        description: 'Case B - January 15th',
      },
      {
        id: 'case_C',
        date: new Date('2024-01-01T00:00:00Z'),
        recommendationScore: 88,
        description: 'Case C - January 1st',
      },
    ];

    const result = visualizeRecommendationBasis(pastCases);

    expect(result).toEqual([
      {
        id: 'case_A',
        date: new Date('2024-01-01T00:00:00Z'),
        recommendationScore: 85,
        description: 'Case A - January 1st',
      },
      {
        id: 'case_C',
        date: new Date('2024-01-01T00:00:00Z'),
        recommendationScore: 88,
        description: 'Case C - January 1st',
      },
      {
        id: 'case_B',
        date: new Date('2024-01-15T00:00:00Z'),
        recommendationScore: 90,
        description: 'Case B - January 15th',
      },
    ]);

    expect(result[0].id).toBe('case_A');
    expect(result[1].id).toBe('case_C');
    expect(result[2].id).toBe('case_B');

    expect(result[0].date.getTime()).toBeLessThanOrEqual(result[1].date.getTime());
    expect(result[1].date.getTime()).toBeLessThanOrEqual(result[2].date.getTime());

    expect(result.length).toBe(3);
  });
});