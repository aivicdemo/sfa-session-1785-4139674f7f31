import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件への提案アプローチを自動推奨', () => {
  test('SCEN-045: 類似パターン検索機能 - 現在の商談条件に類似した過去成功事例が正常に検索されランク付けされる', () => {
    // 準備: 現在の商談条件を定義
    const currentDealCondition = {
      customerIndustry: '製造業',
      budgetAmount: 50000000,
      implementationPeriodMonths: 3,
      businessChallenge: '業務効率化',
    };

    // 準備: AIRecommendationEngineのfindSimilarPatternsスタブを定義
    const mockAiRecommendationEngine = {
      findSimilarPatterns: jest.fn(() => [
        {
          rankPosition: 1,
          similarityScore: 0.92,
          customerIndustry: '製造業',
          budgetAmount: 48000000,
          implementationPeriodMonths: 3,
          closingRate: 87,
          caseId: 'CASE-001',
          metadata: {
            caseTitle: '同業種・同予算帯事例',
            customerName: '製造業A社',
            closingDate: '2024-01-15',
          },
        },
        {
          rankPosition: 2,
          similarityScore: 0.78,
          customerIndustry: '流通業',
          budgetAmount: 45000000,
          implementationPeriodMonths: 4,
          closingRate: 72,
          caseId: 'CASE-002',
          metadata: {
            caseTitle: '関連業種・類似予算事例',
            customerName: '流通業B社',
            closingDate: '2023-12-10',
          },
        },
        {
          rankPosition: 3,
          similarityScore: 0.65,
          customerIndustry: '小売業',
          budgetAmount: 25000000,
          implementationPeriodMonths: 2,
          closingRate: 58,
          caseId: 'CASE-003',
          metadata: {
            caseTitle: '異業種・低予算事例',
            customerName: '小売業C社',
            closingDate: '2023-11-20',
          },
        },
      ]),
    };

    // 実行: 類似パターン検索機能を実行
    const searchResult = findSimilarPatterns(currentDealCondition, mockAiRecommendationEngine);

    // 検証: 検索結果が類似度スコアの高い順に3件すべてが降順でランク付けされている
    expect(searchResult).toHaveLength(3);

    // 検証: 第1位に類似度0.92の事例が表示されている
    expect(searchResult[0].rankPosition).toBe(1);
    expect(searchResult[0].similarityScore).toBe(0.92);
    expect(searchResult[0].caseId).toBe('CASE-001');
    expect(searchResult[0].closingRate).toBe(87);
    expect(searchResult[0].customerIndustry).toBe('製造業');
    expect(searchResult[0].budgetAmount).toBe(48000000);
    expect(searchResult[0].implementationPeriodMonths).toBe(3);

    // 検証: 第2位に類似度0.78の事例が表示されている
    expect(searchResult[1].rankPosition).toBe(2);
    expect(searchResult[1].similarityScore).toBe(0.78);
    expect(searchResult[1].caseId).toBe('CASE-002');
    expect(searchResult[1].closingRate).toBe(72);
    expect(searchResult[1].customerIndustry).toBe('流通業');
    expect(searchResult[1].budgetAmount).toBe(45000000);
    expect(searchResult[1].implementationPeriodMonths).toBe(4);

    // 検証: 第3位に類似度0.65の事例が表示されている
    expect(searchResult[2].rankPosition).toBe(3);
    expect(searchResult[2].similarityScore).toBe(0.65);
    expect(searchResult[2].caseId).toBe('CASE-003');
    expect(searchResult[2].closingRate).toBe(58);
    expect(searchResult[2].customerIndustry).toBe('小売業');
    expect(searchResult[2].budgetAmount).toBe(25000000);
    expect(searchResult[2].implementationPeriodMonths).toBe(2);

    // 検証: 各事例にメタデータが正確に含まれている
    expect(searchResult[0].metadata).toEqual({
      caseTitle: '同業種・同予算帯事例',
      customerName: '製造業A社',
      closingDate: '2024-01-15',
    });

    expect(searchResult[1].metadata).toEqual({
      caseTitle: '関連業種・類似予算事例',
      customerName: '流通業B社',
      closingDate: '2023-12-10',
    });

    expect(searchResult[2].metadata).toEqual({
      caseTitle: '異業種・低予算事例',
      customerName: '小売業C社',
      closingDate: '2023-11-20',
    });

    // 検証: AIRecommendationEngineが正しく呼び出されている
    expect(mockAiRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      currentDealCondition
    );
  });
});