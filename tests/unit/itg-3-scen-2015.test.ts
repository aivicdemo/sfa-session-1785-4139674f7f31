import { generatePersuasionDocumentForExecutives } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2015: 投資対効果スコアが閾値直下（79点）のとき、推奨判定が閾値以下の結果になる', () => {
    // Arrange: AIRecommendationEngineのスタブを構成
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 投資対効果スコア = 79点を返却するようmock
    const roiScore = 79;
    const recommendationThreshold = 80;

    // テスト用の顧客情報と提案内容
    const customerInfo = {
      customer_id: 'CUST-20250101-001',
      customer_name: 'Example Corporation',
      industry: 'Manufacturing',
      company_size: 'Large',
      budget: 5000000,
      timeline_months: 12,
    };

    const proposalContent = {
      proposal_id: 'PROP-20250115-001',
      proposal_title: 'Digital Transformation Initiative',
      proposed_solutions: ['Cloud Migration', 'Process Automation'],
      estimated_cost: 4500000,
      estimated_benefit: 15000000,
      implementation_timeline_months: 12,
    };

    const analysisResult = {
      roi_score: roiScore,
      feasibility_score: 85,
      risk_level: 'Medium',
      constraints_alignment: {
        budget_fit: true,
        timeline_fit: true,
        technical_feasibility: true,
      },
      success_pattern_match: 0.78,
    };

    // Act: 経営層向け説得資料の生成を実行
    const generatedDocument = generatePersuasionDocumentForExecutives(
      customerInfo,
      proposalContent,
      analysisResult,
      mockAIRecommendationEngine
    );

    // Assert: 推奨判定ステータスが『非推奨』または『閾値以下』
    expect(generatedDocument.recommendation_status).toBe('NOT_RECOMMENDED');
    expect(generatedDocument.recommendation_flag).toBe(false);
    expect(generatedDocument.approval_level).toBe('REJECTED');

    // 生成された説得資料に投資対効果スコア: 79点と明記されている
    expect(generatedDocument.document_content).toContain('投資対効果スコア: 79点');
    expect(generatedDocument.roi_score_displayed).toBe(79);

    // 経営層への推奨判定フラグはfalse
    expect(generatedDocument.executive_recommendation_flag).toBe(false);

    // 推奨レベルが『不承認』に設定
    expect(generatedDocument.recommendation_level).toBe('UNAPPROVED');

    // スコアが閾値以下であることを確認
    expect(generatedDocument.roi_score_displayed).toBeLessThan(recommendationThreshold);

    // 根拠情報が含まれていることを確認
    expect(generatedDocument.reasoning_basis).toBeDefined();
    expect(generatedDocument.reasoning_basis.roi_analysis).toContain(
      `投資対効果が${roiScore}点で、推奨閾値${recommendationThreshold}点に達していません`
    );
  });
});