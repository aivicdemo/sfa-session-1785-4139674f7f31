import { generateRecommendationWithPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への提案アプローチ推奨機能', () => {
  // SCEN-2047
  test('過去商談データから抽出した成功パターンが1件のとき、その1件に基づいた提案アプローチが推奨される', () => {
    // Setup: 成功パターンデータベース（1件のみ）
    const past_success_patterns = [
      {
        pattern_id: 'pat_001',
        industry: 'IT企業',
        company_size: '従業員100-500名',
        issue: '業務効率化',
        proposal_approach: 'クラウド導入による工次削減の実績紹介',
        contract_amount: 5000000,
      },
    ];

    // Stub: AIRecommendationEngine
    const ai_engine_stub = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          pattern_id: 'pat_001',
          industry: 'IT企業',
          company_size: '従業員100-500名',
          issue: '業務効率化',
          proposal_approach: 'クラウド導入による工次削減の実績紹介',
          relevance_score: 0.95,
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        pattern_id: 'pat_001',
        relevance_score: 0.95,
        match_reasons: ['課題が業務効率化で一致', '企業規模が類似'],
      }),
      generateRecommendation: jest.fn().mockReturnValue({
        proposal_approach: 'クラウド導入による工次削減の実績紹介',
        confidence_score: 0.92,
        based_on_pattern_id: 'pat_001',
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        explanation: '過去の成功事例（業種IT企業、従業員100-500名、課題業務効率化）に基づいて推奨されました。',
        evidence: ['過去案件との課題一致', '企業規模の類似性'],
      }),
    };

    // Input: 新規案件データ
    const new_deal_input = {
      customer_name: '新規IT企業',
      industry: 'IT企業',
      company_size: '従業員200名',
      issue: '業務効率化',
    };

    // Execute
    const recommendation = generateRecommendationWithPatterns(
      new_deal_input,
      ai_engine_stub
    );

    // Verify: 各関数が正確に1回ずつ呼び出されたことを確認
    expect(ai_engine_stub.findSimilarPatterns).toHaveBeenCalledTimes(1);
    expect(ai_engine_stub.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(ai_engine_stub.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(ai_engine_stub.explainRecommendationReasoning).toHaveBeenCalledTimes(1);

    // Verify: 推奨内容の検証
    // (1) 提案アプローチが『クラウド導入による工次削減の実績紹介』と一致する
    expect(recommendation.proposal_approach).toBe(
      'クラウド導入による工次削減の実績紹介'
    );

    // (2) 根拠説明に『過去の成功事例（業種IT企業、従業員100-500名、課題業務効率化）』と明記されている
    expect(recommendation.explanation).toContain(
      '過去の成功事例（業種IT企業、従業員100-500名、課題業務効率化）'
    );

    // (3) 信頼度スコアが0.90以上である
    expect(recommendation.confidence_score).toBeGreaterThanOrEqual(0.9);
    expect(recommendation.confidence_score).toBe(0.92);

    // (4) パターンマッチ理由として『課題が業務効率化で一致』『企業規模が類似』が含まれている
    expect(recommendation.match_reasons).toContain('課題が業務効率化で一致');
    expect(recommendation.match_reasons).toContain('企業規模が類似');
  });
});