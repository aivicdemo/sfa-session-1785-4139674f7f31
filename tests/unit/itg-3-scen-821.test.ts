import { recordRecommendationReasons } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 推奨履歴記録', () => {
  test('SCEN-821: 推奨根拠データすべてが推奨根拠テーブルに記録される', async () => {
    // Arrange: AIRecommendationEngineのスタブを定義
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: 'rec_001',
        customer_id: 'cust_A',
        deal_condition: 'large_saas_implementation',
        industry: 'IT',
        reasons: [
          {
            reason_id: 'reason_id_1',
            reason_type: 'historical_pattern',
            reason_score: 85,
            reason_description: '過去の類似SaaS案件で成功事例が多い',
            source_pattern_id: 'pattern_001',
            created_timestamp: '2024-01-15T10:00:00Z'
          },
          {
            reason_id: 'reason_id_2',
            reason_type: 'customer_segment_match',
            reason_score: 78,
            reason_description: 'IT業界の大規模企業セグメントとの適合度が高い',
            source_pattern_id: 'pattern_002',
            created_timestamp: '2024-01-15T10:00:00Z'
          },
          {
            reason_id: 'reason_id_3',
            reason_type: 'timing_signal',
            reason_score: 72,
            reason_description: '現在の購買シグナルが過去の成功事例と一致',
            source_pattern_id: 'pattern_003',
            created_timestamp: '2024-01-15T10:00:00Z'
          }
        ]
      })
    };

    // モックデータベース結果
    const mockDatabaseResult = {
      insertedCount: 3,
      records: [
        {
          reason_id: 'reason_id_1',
          reason_type: 'historical_pattern',
          reason_score: 85,
          reason_description: '過去の類似SaaS案件で成功事例が多い',
          source_pattern_id: 'pattern_001',
          created_timestamp: '2024-01-15T10:00:00Z'
        },
        {
          reason_id: 'reason_id_2',
          reason_type: 'customer_segment_match',
          reason_score: 78,
          reason_description: 'IT業種の大規模企業セグメントとの適合度が高い',
          source_pattern_id: 'pattern_002',
          created_timestamp: '2024-01-15T10:00:00Z'
        },
        {
          reason_id: 'reason_id_3',
          reason_type: 'timing_signal',
          reason_score: 72,
          reason_description: '現在の購買シグナルが過去の成功事例と一致',
          source_pattern_id: 'pattern_003',
          created_timestamp: '2024-01-15T10:00:00Z'
        }
      ]
    };

    const mockDatabase = {
      insertRecommendationReasons: jest.fn().mockResolvedValue(mockDatabaseResult)
    };

    // Act: 推奨履歴記録機能を実行
    const input = {
      customer_id: 'cust_A',
      deal_condition: 'large_saas_implementation',
      industry: 'IT',
      ai_engine: mockAIEngine,
      database: mockDatabase
    };

    const result = await recordRecommendationReasons(input);

    // Assert: 推奨根拠テーブルにすべてのレコードが正確に記録されていることを検証
    expect(result.insertedCount).toBe(3);
    
    expect(result.records).toEqual([
      {
        reason_id: 'reason_id_1',
        reason_type: 'historical_pattern',
        reason_score: 85,
        reason_description: '過去の類似SaaS案件で成功事例が多い',
        source_pattern_id: 'pattern_001',
        created_timestamp: '2024-01-15T10:00:00Z'
      },
      {
        reason_id: 'reason_id_2',
        reason_type: 'customer_segment_match',
        reason_score: 78,
        reason_description: 'IT業種の大規模企業セグメントとの適合度が高い',
        source_pattern_id: 'pattern_002',
        created_timestamp: '2024-01-15T10:00:00Z'
      },
      {
        reason_id: 'reason_id_3',
        reason_type: 'timing_signal',
        reason_score: 72,
        reason_description: '現在の購買シグナルが過去の成功事例と一致',
        source_pattern_id: 'pattern_003',
        created_timestamp: '2024-01-15T10:00:00Z'
      }
    ]);

    // 各レコードのフィールドが完全に記録されていることを検証
    result.records.forEach((record, index) => {
      expect(record).toHaveProperty('reason_id');
      expect(record).toHaveProperty('reason_type');
      expect(record).toHaveProperty('reason_score');
      expect(record).toHaveProperty('reason_description');
      expect(record).toHaveProperty('source_pattern_id');
      expect(record).toHaveProperty('created_timestamp');
      
      // NULL値が存在しないことを確認
      expect(record.reason_id).not.toBeNull();
      expect(record.reason_type).not.toBeNull();
      expect(record.reason_score).not.toBeNull();
      expect(record.reason_description).not.toBeNull();
      expect(record.source_pattern_id).not.toBeNull();
      expect(record.created_timestamp).not.toBeNull();
      
      // データ型が正確であることを確認
      expect(typeof record.reason_id).toBe('string');
      expect(typeof record.reason_type).toBe('string');
      expect(typeof record.reason_score).toBe('number');
      expect(typeof record.reason_description).toBe('string');
      expect(typeof record.source_pattern_id).toBe('string');
      expect(typeof record.created_timestamp).toBe('string');
    });

    // AIエンジンとデータベースの呼び出しが適切に実行されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_id: 'cust_A',
        deal_condition: 'large_saas_implementation',
        industry: 'IT'
      })
    );

    expect(mockDatabase.insertRecommendationReasons).toHaveBeenCalledWith(
      expect.objectContaining({
        reasons: expect.arrayContaining([
          expect.objectContaining({ reason_id: 'reason_id_1' }),
          expect.objectContaining({ reason_id: 'reason_id_2' }),
          expect.objectContaining({ reason_id: 'reason_id_3' })
        ])
      })
    );
  });
});