import { generateRecommendationReportWithFallback } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1581
  test('レポートファイル生成がAmazon S3への失敗時に、代替処理が実行される', async () => {
    const customer_name = 'テスト顧客A';
    const proposal_approach = '段階的な提案アプローチ';
    const reasoning_basis = '過去の成功事例に基づいた根拠';

    const recommendation_data = {
      customer_name,
      proposal_approach,
      reasoning_basis,
      confidence_score: 85,
      generated_at: '2024-01-15T11:00:00Z',
    };

    let upload_call_count = 0;
    const file_storage_adapter_stub = {
      uploadRecommendationReport: jest.fn(async () => {
        upload_call_count++;
        throw new Error('S3 Upload Failed');
      }),
    };

    jest.useFakeTimers();

    const result_promise = generateRecommendationReportWithFallback(
      recommendation_data,
      file_storage_adapter_stub
    );

    // 初回呼び出しを検証
    await jest.advanceTimersByTimeAsync(0);
    expect(file_storage_adapter_stub.uploadRecommendationReport).toHaveBeenCalledTimes(1);

    // 3秒待機して1回目の再試行
    await jest.advanceTimersByTimeAsync(3000);
    expect(file_storage_adapter_stub.uploadRecommendationReport).toHaveBeenCalledTimes(2);

    // 10秒待機して2回目の再試行
    await jest.advanceTimersByTimeAsync(10000);
    expect(file_storage_adapter_stub.uploadRecommendationReport).toHaveBeenCalledTimes(3);

    const result = await result_promise;

    // 代替処理の検証
    expect(result.fallback_applied).toBe(true);
    expect(result.html_content).toContain(customer_name);
    expect(result.html_content).toContain(proposal_approach);
    expect(result.html_content).toContain(reasoning_basis);
    expect(result.user_message).toMatch(
      /レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください/
    );
    expect(result.html_content).toMatch(/<!DOCTYPE html/i);
    expect(result.is_browser_saveable).toBe(true);

    jest.useRealTimers();
  });
});