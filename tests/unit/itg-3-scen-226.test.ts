import { displayReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-226: 推奨根拠データが空オブジェクトのとき、根拠表示処理がエラーになる', () => {
    const emptyReasoningData = {};

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(emptyReasoningData),
    };

    const mockFallbackPatternMaster = [
      {
        pattern_id: 'PAT_001',
        success_rate: 0.95,
        customer_segment: 'large_enterprise',
        approach: '経営層への提案',
        frequency: 150,
      },
      {
        pattern_id: 'PAT_002',
        success_rate: 0.88,
        customer_segment: 'mid_market',
        approach: '実務層へのアプローチ',
        frequency: 120,
      },
    ];

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        file_path: 's3://bucket/fallback-report.pdf',
        created_at: '2024-01-15T10:30:00Z',
      }),
    };

    const input = {
      recommendation_id: 'REC_20240115_001',
      customer_id: 'CUST_12345',
      aiEngine: mockAIEngine,
      fallbackPatternMaster: mockFallbackPatternMaster,
      fileStorage: mockFileStorage,
    };

    expect(() => {
      displayReasoning(input);
    }).toThrow(/根拠データが不正です|必須フィールドが不足しています/);
  });
});