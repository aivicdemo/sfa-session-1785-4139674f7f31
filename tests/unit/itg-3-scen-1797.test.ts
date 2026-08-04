import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨機能 - 顧客属性と過去成功パターンの照合', () => {
  // SCEN-1797
  test('新規案件の顧客属性が過去成功パターンと照合され、類似度最高の事例に基づいた提案アプローチと根拠が返却される', () => {
    // 新規案件の顧客属性データ
    const newDealData = {
      industry: '製造業',
      companySize: 500,
      budget: 5000000,
      challengeArea: '生産効率化'
    };

    // 推奨パターンマスタの過去成功事例
    const successPatterns = [
      {
        id: 'pattern_001',
        industry: '製造業',
        companySize: 500,
        budgetRange: '500万円',
        proposalApproach: '生産効率化向けのモジュール構成、導入支援体制の提示',
        similarityScore: 0.92
      },
      {
        id: 'pattern_002',
        industry: 'IT',
        companySize: 300,
        budgetRange: '800万円',
        proposalApproach: 'DX推進向けのエンタープライズ機能',
        similarityScore: 0.45
      },
      {
        id: 'pattern_003',
        industry: '卸売業',
        companySize: 700,
        budgetRange: '300万円',
        proposalApproach: '流通効率化向けの軽量構成',
        similarityScore: 0.38
      }
    ];

    // AIRecommendationEngineの呼び出し窓口をスタブで準備
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue({
        matchedPatterns: [successPatterns[0]],
        topSimilarityScore: 0.92
      })
    };

    // 推奨パターンマスタから最も類似度の高い事例を抽出
    const result = findSimilarPatterns(newDealData, mockAIRecommendationEngine);

    // AIRecommendationEngineが正しく呼び出されたことを確認
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealData,
      expect.anything()
    );

    // 戻り値の推奨内容に成功事例①に基づく提案アプローチが含まれていることを検証
    expect(result.topRecommendation.proposalApproach).toBe('生産効率化向けのモジュール構成、導入支援体制の提示');
    expect(result.topRecommendation.industry).toBe('製造業');
    expect(result.topRecommendation.companySize).toBe(500);

    // 推奨内容の根拠説明を確認
    expect(result.reasoning).toContain('顧客属性が過去成功パターン');
    expect(result.reasoning).toContain('0.92');

    // 類似度スコアが期待値と一致することを確認
    expect(result.similarityScore).toBe(0.92);

    // 推奨パターンIDが正しいことを確認
    expect(result.topRecommendation.id).toBe('pattern_001');
  });
});