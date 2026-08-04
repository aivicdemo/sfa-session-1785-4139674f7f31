import { generateRecommendationReportWithStorage } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-815
  test('推奨報告レポートがExcel形式で正常にアップロードされる', () => {
    const recommendation_id = 'rec-123';
    const proposal_text = '顧客の経営課題に対応した提案内容';
    const reasoning_explanation = '過去の成功事例との類似度が高く、同業種での採用率が85%であることが根拠';
    const generated_timestamp = '2024-01-15T10:30:00Z';

    const mock_ai_engine = {
      generateRecommendation: jest.fn().mockReturnValue({
        id: recommendation_id,
        proposal: proposal_text,
        reasoning: reasoning_explanation,
        confidence_score: 85,
      }),
    };

    const mock_file_storage = {
      uploadRecommendationReport: jest.fn().mockReturnValue({
        fileKey: 'reports/rec-123.xlsx',
        uploadedAt: '2024-01-15T10:31:45Z',
        fileSizeBytes: 51200,
      }),
    };

    const input_customer_data = {
      customer_id: 'cust-001',
      industry: '製造業',
      company_size: '従業員数500名',
    };

    const input_deal_conditions = {
      deal_stage: '提案済み',
      estimated_amount: 5000000,
      deal_timeline: '3ヶ月',
    };

    const result = generateRecommendationReportWithStorage(
      input_customer_data,
      input_deal_conditions,
      mock_ai_engine,
      mock_file_storage,
      generated_timestamp
    );

    expect(mock_ai_engine.generateRecommendation).toHaveBeenCalledWith(
      input_customer_data,
      input_deal_conditions
    );

    expect(mock_file_storage.uploadRecommendationReport).toHaveBeenCalled();
    const upload_call_args = mock_file_storage.uploadRecommendationReport.mock.calls[0][0];

    expect(upload_call_args.fileFormat).toBe('xlsx');
    expect(upload_call_args.content).toHaveProperty('recommendationId', recommendation_id);
    expect(upload_call_args.content).toHaveProperty('proposal', proposal_text);
    expect(upload_call_args.content).toHaveProperty('reasoning', reasoning_explanation);
    expect(upload_call_args.content).toHaveProperty('generatedAt', generated_timestamp);

    expect(result.fileKey).toBe('reports/rec-123.xlsx');
    expect(result.uploadedAt).toBe('2024-01-15T10:31:45Z');
    expect(result.fileSizeBytes).toBe(51200);

    const uploaded_at_date = new Date(result.uploadedAt);
    expect(uploaded_at_date.toISOString()).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  });
});