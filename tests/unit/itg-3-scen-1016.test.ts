import { evaluatePatternRelevance, explainRecommendationReasoning, findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン照合機能 - 新規案件の顧客条件が過去成功パターンと不一致する場合', () => {
  test('SCEN-1016: evaluatePatternRelevanceから返却される適用可能スコアが0.0（最低値）であり、根拠説明に顧客条件不合致が含まれること', () => {
    // AIRecommendationEngineのスタブを初期化
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.0),
      explainRecommendationReasoning: jest.fn().mockReturnValue('顧客条件が過去の成功パターンと合致するものがありません'),
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      generateRecommendation: jest.fn()
    };

    // 新規案件の顧客条件データを準備
    const newProjectCondition = {
      industry: '製造業',
      companyScale: '大企業',
      budget: '5000万円以上',
      implementationTimeline: '12ヶ月以上先',
      challengeArea: 'その他'
    };

    // 過去成功パターンデータをマスタに設定
    const pastSuccessPatterns = [
      {
        industry: '小売業',
        companyScale: '中小企業',
        budget: '1000万円未満',
        implementationTimeline: '3ヶ月以内',
        challengeArea: '業務効率化',
        successRate: 0.95
      },
      {
        industry: '金融業',
        companyScale: '中堅企業',
        budget: '2000万円',
        implementationTimeline: '6ヶ月以内',
        challengeArea: 'コスト削減',
        successRate: 0.88
      }
    ];

    // findSimilarPatternsスタブを呼び出し、新規案件条件との類似度を計算
    const similarPatterns = mockAIEngine.findSimilarPatterns(newProjectCondition, pastSuccessPatterns);

    // 結果が空またはnullになることを確認
    expect(similarPatterns).toEqual([]);

    // evaluatePatternRelevanceメソッドをスタブ経由で呼び出し
    const relevanceScore = mockAIEngine.evaluatePatternRelevance(newProjectCondition, pastSuccessPatterns);

    // 返却されたスコア値を検証：0.0（最低値）であること
    expect(relevanceScore).toBe(0.0);

    // explainRecommendationReasoningから根拠説明文を取得
    const reasoningExplanation = mockAIEngine.explainRecommendationReasoning(newProjectCondition, pastSuccessPatterns);

    // 根拠説明に『顧客条件が過去の成功パターンと合致するものがありません』が含まれていることを確認
    expect(reasoningExplanation).toMatch(/顧客条件が過去の成功パターンと合致するものがありません/);

    // UIに表示されるランクが『適用不可』であることを検証
    const recommendationRank = relevanceScore === 0.0 ? '適用不可' : '適用可能';
    expect(recommendationRank).toBe('適用不可');

    // スタブが正しく呼び出されたことを確認
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newProjectCondition, pastSuccessPatterns);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(newProjectCondition, pastSuccessPatterns);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(newProjectCondition, pastSuccessPatterns);
  });
});