import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1788: AIエージェント呼び出し失敗時、内部推奨パターンマスタから抽出した根拠が表示される', async () => {
    fetchMock.resetMocks();

    const mockAIEngineStub = {
      generateRecommendation: jest.fn()
        .mockRejectedValueOnce(new Error('API timeout'))
        .mockRejectedValueOnce(new Error('API timeout'))
        .mockRejectedValueOnce(new Error('API timeout')),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({ success: true }),
      generateDownloadUrl: jest.fn().mockResolvedValue('https://example.com/report'),
      deleteExpiredReports: jest.fn().mockResolvedValue({ deleted: 0 }),
    };

    const input_case = {
      customer_industry: 'IT',
      budget_amount_yen: 5000000,
      deal_stage: '初期接触',
      ai_engine: mockAIEngineStub,
      file_storage_adapter: mockFileStorageAdapter,
    };

    const result = await generateRecommendation(input_case);

    expect(result).toEqual({
      recommendation_status: 'fallback_internal_pattern',
      display_message: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      recommendation_type: 'success_pattern',
      success_pattern_count: 3,
      recommendation_basis: {
        past_success_rate: 78,
        average_implementation_period_months: 3,
        primary_implementation_effect: 'コスト削減',
        industry_match: 'IT',
        budget_range_match: true,
        statistical_confidence_score: 78,
      },
      simplified_explanation: '過去3年間で同業界・同予算規模での提案成功率78%。導入期間: 平均3ヶ月。主要な導入効果: コスト削減',
      retry_attempts_executed: 3,
      fallback_source: 'internal_recommendation_pattern_master',
    });

    expect(mockAIEngineStub.generateRecommendation).toHaveBeenCalledTimes(3);
  });
});