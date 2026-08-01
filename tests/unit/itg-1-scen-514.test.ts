import { calculateAIInferenceAccuracyScore } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-514
  test('AIエージェント推論精度スコア算出 - 複数データソースの精度スコア計算', () => {
    const salesPersonId = 'sales_person_001';
    const behaviorPatternData = [
      {
        dataSourceId: 'ds_visit_001',
        dataSourceType: 'visit_record',
        salesPersonId: salesPersonId,
        timestamp: new Date('2024-01-15T09:00:00Z'),
        actionDescription: '顧客A訪問',
        outcomeScore: 0.87,
      },
      {
        dataSourceId: 'ds_proposal_001',
        dataSourceType: 'proposal_delivery',
        salesPersonId: salesPersonId,
        timestamp: new Date('2024-01-16T14:30:00Z'),
        actionDescription: '提案資料送付',
        outcomeScore: 0.92,
      },
      {
        dataSourceId: 'ds_followup_001',
        dataSourceType: 'followup_call',
        salesPersonId: salesPersonId,
        timestamp: new Date('2024-01-17T10:15:00Z'),
        actionDescription: 'フォローアップ電話',
        outcomeScore: 0.79,
      },
    ];

    const result = calculateAIInferenceAccuracyScore({
      salesPersonId: salesPersonId,
      behaviorPatternDataList: behaviorPatternData,
      analysisStartDate: new Date('2024-01-01T00:00:00Z'),
      analysisEndDate: new Date('2024-01-31T23:59:59Z'),
    });

    expect(result.processedDataCount).toBe(3);
    expect(result.dataSourceScores).toHaveLength(3);
    
    expect(result.dataSourceScores[0]).toEqual({
      dataSourceId: 'ds_visit_001',
      dataSourceType: 'visit_record',
      inferenceAccuracyScore: 0.87,
    });
    
    expect(result.dataSourceScores[1]).toEqual({
      dataSourceId: 'ds_proposal_001',
      dataSourceType: 'proposal_delivery',
      inferenceAccuracyScore: 0.92,
    });
    
    expect(result.dataSourceScores[2]).toEqual({
      dataSourceId: 'ds_followup_001',
      dataSourceType: 'followup_call',
      inferenceAccuracyScore: 0.79,
    });

    const expectedAverageScore = (0.87 + 0.92 + 0.79) / 3;
    expect(result.averageAccuracyScore).toBeCloseTo(0.86, 2);
    expect(result.averageAccuracyScore).toBe(expectedAverageScore);

    expect(result.salesPersonId).toBe(salesPersonId);
    expect(result.analysisCompletedAt).toBeDefined();
    expect(typeof result.analysisCompletedAt).toBe('string');
  });
});