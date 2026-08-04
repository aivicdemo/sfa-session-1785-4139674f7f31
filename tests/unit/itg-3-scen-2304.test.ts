import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2304: 提案内容と顧客対応パターンの標準プロセス比較機能 - 異常パターンの検出スコアがちょうど閾値のとき異常判定される', () => {
    // Arrange
    const ANOMALY_THRESHOLD = 0.65;
    
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0.65,
        isAnomaly: true,
        anomalyThreshold: ANOMALY_THRESHOLD
      })
    };

    const proposalContent = {
      approach: '顧客課題に基づいた提案',
      targetCustomer: '中堅製造業',
      proposedActions: ['初回ヒアリング実施', '改善案提出']
    };

    const standardProcessPattern = {
      customerSegment: '中堅製造業',
      successActions: ['初回ヒアリング実施', '改善案提出', 'ROI説明'],
      approachType: '顧客課題解決型'
    };

    // Act
    const result = evaluatePatternRelevance(
      proposalContent,
      standardProcessPattern,
      mockAIRecommendationEngine
    );

    // Assert
    expect(result.anomalyDetected).toBe(true);
    expect(result.relevanceScore).toBe(0.65);
    expect(result.threshold).toBe(0.65);
    expect(result.decision).toBe('ANOMALY_DETECTED');
    expect(result.deviationMessage).toMatch(/標準プロセスから逸脱/);
    expect(result.requestLog).toEqual({
      anomalyDetected: true,
      relevanceScore: 0.65,
      threshold: 0.65,
      decision: 'ANOMALY_DETECTED'
    });
  });
});