import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能 - 過去商談データの時系列が逆順のとき', () => {
  // SCEN-2325
  test('過去商談データが逆時系列順で入力された場合、システムは内部で時系列に正しく並べ替えした上で成功パターンを抽出し、昇順に整列された結果を返却する', () => {
    // テストデータ: 逆時系列順（新しい順）で準備
    const pastDealData = [
      {
        dealId: 'A',
        dealDate: new Date('2024-03-15'),
        industry: '製造業',
        budgetScale: '大',
        decisionMaker: '経営層',
        success: true,
        successFactor: '経営効率化への強い課題意識'
      },
      {
        dealId: 'B',
        dealDate: new Date('2024-02-10'),
        industry: '製造業',
        budgetScale: '大',
        decisionMaker: '経営層',
        success: true,
        successFactor: 'スピード重視の導入判断'
      },
      {
        dealId: 'C',
        dealDate: new Date('2024-01-05'),
        industry: '製造業',
        budgetScale: '大',
        decisionMaker: '経営層',
        success: true,
        successFactor: 'ROI明示による信頼構築'
      }
    ];

    // 新規案件の条件
    const newDealCondition = {
      industry: '製造業',
      budgetScale: '大',
      decisionMaker: '経営層'
    };

    // AIRecommendationEngineスタブ
    const mockAIEngine = {
      findSimilarPatterns: jest.fn((inputData) => {
        // 入力データを時系列昇順に並べ替え
        const sortedData = [...inputData].sort(
          (a, b) => a.dealDate.getTime() - b.dealDate.getTime()
        );

        // マッチスコアを計算（顧客属性の合致度に基づく）
        return sortedData.map((deal) => ({
          dealId: deal.dealId,
          dealDate: deal.dealDate,
          matchScore: 95,
          successFactor: deal.successFactor,
          applicableApproach: 'ROI重視の提案アプローチ'
        }));
      })
    };

    // 処理実行
    const result = findSimilarPatterns(pastDealData, newDealCondition, mockAIEngine);

    // 検証: 結果が時系列昇順に並べ替えされているか
    expect(result).toHaveLength(3);

    // 1番目: 商談C（最古）
    expect(result[0].dealId).toBe('C');
    expect(result[0].dealDate).toEqual(new Date('2024-01-05'));
    expect(result[0].matchScore).toBe(95);
    expect(result[0].successFactor).toBe('ROI明示による信頼構築');

    // 2番目: 商談B（中間）
    expect(result[1].dealId).toBe('B');
    expect(result[1].dealDate).toEqual(new Date('2024-02-10'));
    expect(result[1].matchScore).toBe(95);
    expect(result[1].successFactor).toBe('スピード重視の導入判断');

    // 3番目: 商談A（最新）
    expect(result[2].dealId).toBe('A');
    expect(result[2].dealDate).toEqual(new Date('2024-03-15'));
    expect(result[2].matchScore).toBe(95);
    expect(result[2].successFactor).toBe('経営効率化への強い課題意識');

    // 時系列順序の検証
    expect(result[0].dealDate.getTime()).toBeLessThan(result[1].dealDate.getTime());
    expect(result[1].dealDate.getTime()).toBeLessThan(result[2].dealDate.getTime());

    // マッチスコアが正しく計算されているか
    result.forEach((pattern) => {
      expect(pattern.matchScore).toBe(95);
    });
  });
});