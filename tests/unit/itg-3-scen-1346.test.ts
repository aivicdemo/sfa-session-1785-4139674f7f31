import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への推奨機能', () => {
  // SCEN-1346
  test('同じ新規案件条件で推奨生成を2回実行したとき、2回とも同じ推奨アプローチが返される', () => {
    // 新規案件条件を準備
    const newDealCondition = {
      customerIndustry: '製造業',
      dealStage: '提案前',
      budgetScale: 5000000,
      decisionMakerCount: 3,
    };

    // AIRecommendationEngineのスタブ化
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendationApproachId: 'APP-2024-001',
        approachContent: '製造業向けの段階的導入アプローチ：まず現状調査から開始し、業務プロセス可視化を通じて効果測定のための基準値を確立する',
        reasoningExplanation: '類似成功事例から、製造業での大型投資は導入前の現状調査と効果測定体制の整備が重要な成功要因であることが判明。本アプローチは予算規模5000万円と決定者数3名の条件に適合する',
        similarSuccessCases: [
          {
            caseId: 'CASE-2023-045',
            customerName: 'A製造業',
            industry: '製造業',
            contractAmount: 4800000,
            approachUsed: '段階的導入',
            outcomeAmount: 4800000,
          },
          {
            caseId: 'CASE-2023-062',
            customerName: 'B重工業',
            industry: '製造業',
            contractAmount: 5200000,
            approachUsed: '段階的導入',
            outcomeAmount: 5200000,
          },
          {
            caseId: 'CASE-2023-078',
            customerName: 'C部品工業',
            industry: '製造業',
            contractAmount: 4500000,
            approachUsed: '段階的導入',
            outcomeAmount: 4500000,
          },
        ],
      }),
    };

    // 1回目の推奨生成実行
    const result1 = generateRecommendation(newDealCondition, mockRecommendationEngine);

    // 2回目の推奨生成実行
    const result2 = generateRecommendation(newDealCondition, mockRecommendationEngine);

    // 推奨アプローチIDの完全一致を検証
    expect(result1.recommendationApproachId).toBe('APP-2024-001');
    expect(result2.recommendationApproachId).toBe('APP-2024-001');
    expect(result1.recommendationApproachId).toBe(result2.recommendationApproachId);

    // アプローチ内容（文言）の完全一致を検証
    expect(result1.approachContent).toBe('製造業向けの段階的導入アプローチ：まず現状調査から開始し、業務プロセス可視化を通じて効果測定のための基準値を確立する');
    expect(result2.approachContent).toBe('製造業向けの段階的導入アプローチ：まず現状調査から開始し、業務プロセス可視化を通じて効果測定のための基準値を確立する');
    expect(result1.approachContent).toBe(result2.approachContent);

    // 根拠説明（文言）の完全一致を検証
    expect(result1.reasoningExplanation).toBe('類似成功事例から、製造業での大型投資は導入前の現状調査と効果測定体制の整備が重要な成功要因であることが判明。本アプローチは予算規模5000万円と決定者数3名の条件に適合する');
    expect(result2.reasoningExplanation).toBe('類似成功事例から、製造業での大型投資は導入前の現状調査と効果測定体制の整備が重要な成功要因であることが判明。本アプローチは予算規模5000万円と決定者数3名の条件に適合する');
    expect(result1.reasoningExplanation).toBe(result2.reasoningExplanation);

    // 類似成功事例リスト（事例ID、順序、内容を含む）の完全一致を検証
    expect(result1.similarSuccessCases).toHaveLength(3);
    expect(result2.similarSuccessCases).toHaveLength(3);

    expect(result1.similarSuccessCases[0].caseId).toBe('CASE-2023-045');
    expect(result2.similarSuccessCases[0].caseId).toBe('CASE-2023-045');
    expect(result1.similarSuccessCases[0].caseId).toBe(result2.similarSuccessCases[0].caseId);

    expect(result1.similarSuccessCases[0].customerName).toBe('A製造業');
    expect(result2.similarSuccessCases[0].customerName).toBe('A製造業');
    expect(result1.similarSuccessCases[0].customerName).toBe(result2.similarSuccessCases[0].customerName);

    expect(result1.similarSuccessCases[0].industry).toBe('製造業');
    expect(result2.similarSuccessCases[0].industry).toBe('製造業');

    expect(result1.similarSuccessCases[0].contractAmount).toBe(4800000);
    expect(result2.similarSuccessCases[0].contractAmount).toBe(4800000);

    expect(result1.similarSuccessCases[1].caseId).toBe('CASE-2023-062');
    expect(result2.similarSuccessCases[1].caseId).toBe('CASE-2023-062');
    expect(result1.similarSuccessCases[1].caseId).toBe(result2.similarSuccessCases[1].caseId);

    expect(result1.similarSuccessCases[1].customerName).toBe('B重工業');
    expect(result2.similarSuccessCases[1].customerName).toBe('B重工業');

    expect(result1.similarSuccessCases[2].caseId).toBe('CASE-2023-078');
    expect(result2.similarSuccessCases[2].caseId).toBe('CASE-2023-078');
    expect(result1.similarSuccessCases[2].caseId).toBe(result2.similarSuccessCases[2].caseId);

    expect(result1.similarSuccessCases[2].customerName).toBe('C部品工業');
    expect(result2.similarSuccessCases[2].customerName).toBe('C部品工業');

    // 全体的な類似成功事例リストの深い一致を検証
    expect(result1.similarSuccessCases).toEqual(result2.similarSuccessCases);

    // スタブが呼び出されたことを確認
    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(2);
  });
});