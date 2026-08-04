import { generateRecommendationReport } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2484
  test('推奨内容をPDF形式で生成し、Amazon S3にアップロードされる', async () => {
    const deal_id = 'DEAL-20240115-001';
    const timestamp = '2024-01-15T11:30:00Z';
    const bucket_name = 'sales-recommendations-prod';

    // AIRecommendationEngine スタブ
    const ai_engine_stub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposal_approach: '顧客の経営課題解決に向けた段階的な導入アプローチ',
        success_cases: [
          {
            case_id: 'CASE-2023-101',
            customer_industry: '製造業',
            solution_applied: 'デジタル化推進',
            result_summary: '3ヶ月で業務効率30%改善'
          }
        ],
        reasoning_explanation: '類似顧客での成功率85%、課題パターン一致度92%に基づいた推奨'
      })
    };

    // FileStorageAdapter スタブ
    const file_storage_stub = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        object_key: `recommendations/${deal_id}/recommendation_${deal_id}_${timestamp}.pdf`,
        bucket_name: bucket_name,
        upload_timestamp: timestamp
      })
    };

    const recommendation_input = {
      deal_id: deal_id,
      customer_name: 'サンプル株式会社',
      industry: '製造業',
      company_scale: 'mid',
      business_challenges: ['デジタル化対応', '業務効率化'],
      proposed_solution: 'クラウドERP導入支援'
    };

    const result = await generateRecommendationReport(
      recommendation_input,
      ai_engine_stub,
      file_storage_stub,
      bucket_name,
      timestamp
    );

    // uploadRecommendationReport が1回だけ呼び出されたことを検証
    expect(file_storage_stub.uploadRecommendationReport).toHaveBeenCalledTimes(1);

    // 第1引数：PDF形式のバイナリデータ（ファイルヘッダが %PDF で始まる）
    const call_args = file_storage_stub.uploadRecommendationReport.mock.calls[0];
    const pdf_data = call_args[0];
    expect(typeof pdf_data).toBe('string');
    expect(pdf_data.startsWith('%PDF')).toBe(true);

    // 第2引数：正しいファイル名パターン（recommendation_<案件ID>_<タイムスタンプ>.pdf）
    const file_name = call_args[1];
    expect(file_name).toMatch(/^recommendation_DEAL-20240115-001_2024-01-15T11:30:00Z\.pdf$/);

    // 第3引数：S3バケット名
    const s3_bucket = call_args[2];
    expect(s3_bucket).toBe(bucket_name);

    // レスポンスに成功メッセージが含まれる
    expect(result.success_message).toBe('レポートがアップロードされました');

    // レスポンスにS3メタデータが含まれる
    expect(result.upload_metadata).toEqual({
      object_key: `recommendations/${deal_id}/recommendation_${deal_id}_${timestamp}.pdf`,
      bucket_name: bucket_name,
      upload_timestamp: timestamp
    });

    // AIエージェントが推奨生成を呼び出したことを検証
    expect(ai_engine_stub.generateRecommendation).toHaveBeenCalledWith(
      recommendation_input
    );

    // PDF内容に推奨情報が含まれていることを検証
    expect(result.pdf_content_validation).toEqual({
      includes_proposal_approach: true,
      includes_success_cases: true,
      includes_reasoning: true
    });
  });
});