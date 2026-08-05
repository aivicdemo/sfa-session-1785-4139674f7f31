import { analyzeAnomalousPatterns } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-668
  test('同じ提案内容と顧客対応記録の再分析 - 同じ異常パターン検出結果が得られることを検証', () => {
    // Arrange: テスト用データの準備
    const proposalData = {
      proposal_id: 'PROP-001',
      amount: 5000000,
      proposal_date: '2024-01-15',
      customer_id: 'CUST-001',
      sales_stage: 'initial_contact',
      proposal_content: '契約型システム導入提案',
    };

    const activityRecord = {
      activity_id: 'ACT-001',
      activity_datetime: '2024-01-16T10:00:00Z',
      activity_type: 'initial_visit',
      customer_response: 'positive',
      customer_id: 'CUST-001',
      contact_duration_minutes: 45,
    };

    const standardProcess = {
      stage_sequence: ['initial_contact', 'proposal', 'negotiation', 'closing'],
      expected_response_rate: 0.8,
      expected_followup_interval_days: 3,
    };

    // Act: 1回目の異常パターン分析を実行
    const firstAnalysisResult = analyzeAnomalousPatterns({
      proposal: proposalData,
      activity: activityRecord,
      standardProcess: standardProcess,
    });

    // Act: 2回目の異常パターン分析を実行（同じデータで）
    const secondAnalysisResult = analyzeAnomalousPatterns({
      proposal: proposalData,
      activity: activityRecord,
      standardProcess: standardProcess,
    });

    // Assert: 1回目と2回目の分析結果が完全に一致することを検証
    expect(firstAnalysisResult.anomaly_patterns.length).toBe(
      secondAnalysisResult.anomaly_patterns.length
    );

    // 各異常パターンの詳細が一致することを検証
    firstAnalysisResult.anomaly_patterns.forEach((firstPattern, index) => {
      const secondPattern = secondAnalysisResult.anomaly_patterns[index];

      expect(firstPattern.anomaly_type).toBe(secondPattern.anomaly_type);
      expect(firstPattern.anomaly_level).toBe(secondPattern.anomaly_level);
      expect(firstPattern.sales_stage).toBe(secondPattern.sales_stage);
      expect(firstPattern.detection_score).toBe(secondPattern.detection_score);
    });

    // 全体の分析スコアが一致することを検証
    expect(firstAnalysisResult.overall_analysis_score).toBe(
      secondAnalysisResult.overall_analysis_score
    );

    // 分析メタデータが一致することを検証
    expect(firstAnalysisResult.proposal_id).toBe(secondAnalysisResult.proposal_id);
    expect(firstAnalysisResult.activity_id).toBe(secondAnalysisResult.activity_id);
  });
});