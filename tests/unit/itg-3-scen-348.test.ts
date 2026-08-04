import { evaluateRecommendationAccuracy } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-348
  test('[normal] 推奨精度検証機能 - OpenAI API が正常応答した場合、AIが生成した改善提案が結果に含まれる', () => {
    // Arrange: AIRecommendationEngine のスタブを定義
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: '顧客の業種特性を踏まえた段階的なアプローチを提案。初期接触では経営課題の深堀、第2段階で解決案の提示、第3段階で投資対効果の説明を実施することで、購買決定プロセスを加速',
        relevanceScore: 0.87,
        reasoning: '過去の類似案件（同業種・同規模）において、段階的アプローチにより成約率が78%に到達した実績あり。本案件の顧客属性（製造業・従業員500名規模）と完全一致。推奨スコアは学習データ内の成功パターン適合度から算出'
      })
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        reportUrl: 'https://s3.example.com/reports/rec-2024-01-15-001.pdf',
        expiresAt: '2024-01-22T11:00:00Z'
      })
    };

    // テスト用の新規案件データを準備
    const testCaseData = {
      customerId: 'CUST-20240115-001',
      customerName: '株式会社サンプル製造',
      industry: '製造業',
      companySize: 500,
      mainChallenge: '生産効率向上と品質管理の自動化',
      currentProcessMaturity: 2,
      budget: 5000000,
      decisionTimeframe: '3ヶ月以内',
      previousInteractionCount: 2,
      lastContactDate: '2024-01-10T14:30:00Z'
    };

    // Act: 推奨精度検証機能を実行
    const result = evaluateRecommendationAccuracy(
      testCaseData,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    // Assert: recommendations オブジェクトの要素を検証
    expect(result.recommendationStatus).toBe('success');
    expect(result.recommendations).toBeDefined();
    
    expect(result.recommendations.proposalApproach).toBe(
      '顧客の業種特性を踏まえた段階的なアプローチを提案。初期接触では経営課題の深堀、第2段階で解決案の提示、第3段階で投資対効果の説明を実施することで、購買決定プロセスを加速'
    );
    
    expect(result.recommendations.relevanceScore).toBe(0.87);
    expect(typeof result.recommendations.relevanceScore).toBe('number');
    expect(result.recommendations.relevanceScore).toBeGreaterThanOrEqual(0);
    expect(result.recommendations.relevanceScore).toBeLessThanOrEqual(1);
    
    expect(result.recommendations.reasoning).toBe(
      '過去の類似案件（同業種・同規模）において、段階的アプローチにより成約率が78%に到達した実績あり。本案件の顧客属性（製造業・従業員500名規模）と完全一致。推奨スコアは学習データ内の成功パターン適合度から算出'
    );
    
    // すべての要素が null・undefined・空文字列でないことを確認
    expect(result.recommendations.proposalApproach).not.toBe('');
    expect(result.recommendations.proposalApproach).not.toBeNull();
    expect(result.recommendations.proposalApproach).not.toBeUndefined();
    
    expect(result.recommendations.reasoning).not.toBe('');
    expect(result.recommendations.reasoning).not.toBeNull();
    expect(result.recommendations.reasoning).not.toBeUndefined();
    
    expect(result.recommendations.relevanceScore).not.toBeNull();
    expect(result.recommendations.relevanceScore).not.toBeUndefined();
    
    // スタブが呼ばれたことを確認
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'CUST-20240115-001',
        industry: '製造業',
        companySize: 500
      })
    );
  });
});