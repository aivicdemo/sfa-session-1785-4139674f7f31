import { uploadRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - レポート生成・保存機能', () => {
  // SCEN-1177
  test('S3アップロード2回の再試行がすべて失敗したとき、HTML形式での画面表示に自動フォールバックする', async () => {
    const mockS3Client = {
      putObject: jest.fn()
        .mockRejectedValueOnce(new Error('AccessDenied'))
        .mockRejectedValueOnce(new Error('ServiceUnavailable')),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(async (reportData, s3Client) => {
        const maxRetries = 2;
        let lastError: Error | null = null;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            await s3Client.putObject(reportData);
            return {
              success: true,
              type: 's3',
              url: 'https://s3.example.com/reports/test-report.pdf',
            };
          } catch (error) {
            lastError = error as Error;
            if (attempt < maxRetries) {
              const backoffMs = attempt === 0 ? 3000 : 10000;
              await new Promise((resolve) => setTimeout(resolve, backoffMs));
            }
          }
        }

        const htmlReport = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>推奨レポート</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background-color: #f0f0f0; }
    .section { margin: 20px 0; }
  </style>
</head>
<body>
  <h1>推奨レポート</h1>
  
  <div class="section">
    <h2>推奨内容</h2>
    <table>
      <tr>
        <th>項目</th>
        <th>内容</th>
      </tr>
      <tr>
        <td>顧客名</td>
        <td>${reportData.customer_name || 'N/A'}</td>
      </tr>
      <tr>
        <td>提案内容</td>
        <td>${reportData.proposal_content || 'N/A'}</td>
      </tr>
      <tr>
        <td>推奨タイミング</td>
        <td>${reportData.recommended_timing || 'N/A'}</td>
      </tr>
    </table>
  </div>
  
  <div class="section">
    <h2>根拠説明</h2>
    <p>${reportData.reasoning_basis || 'N/A'}</p>
  </div>
  
  <div class="section">
    <h2>操作履歴</h2>
    <table>
      <tr>
        <th>タイムスタンプ</th>
        <th>操作内容</th>
      </tr>
      <tr>
        <td>${reportData.operation_timestamp || 'N/A'}</td>
        <td>${reportData.operation_description || 'N/A'}</td>
      </tr>
    </table>
  </div>
</body>
</html>`;

        return {
          success: false,
          type: 'html',
          html_content: htmlReport,
          fallback_reason: `S3アップロード失敗: ${lastError?.message}`,
        };
      }),
    };

    const reportData = {
      customer_name: 'テスト顧客A社',
      proposal_content: 'クラウド導入提案',
      recommended_timing: '2024年Q2',
      reasoning_basis:
        '過去の類似案件での成功パターンとAI分析に基づいた推奨',
      operation_timestamp: '2024-01-15T11:00:00Z',
      operation_description: 'レポート生成リクエスト',
    };

    const result = await mockFileStorageAdapter.uploadRecommendationReport(
      reportData,
      mockS3Client,
    );

    expect(result.success).toBe(false);
    expect(result.type).toBe('html');
    expect(result.html_content).toContain('<!DOCTYPE html>');
    expect(result.html_content).toContain('<html>');
    expect(result.html_content).toContain('</html>');
    expect(result.html_content).toContain('<h1>推奨レポート</h1>');
    expect(result.html_content).toContain('テスト顧客A社');
    expect(result.html_content).toContain('クラウド導入提案');
    expect(result.html_content).toContain('2024年Q2');
    expect(result.html_content).toContain(
      '過去の類似案件での成功パターンとAI分析に基づいた推奨',
    );
    expect(result.html_content).toContain('2024-01-15T11:00:00Z');
    expect(result.html_content).toContain('レポート生成リクエスト');
    expect(result.html_content).toContain('<table>');
    expect(result.html_content).toContain('</table>');
    expect(result.html_content).toContain('<div class="section">');
    expect(result.html_content).toContain('推奨内容');
    expect(result.html_content).toContain('根拠説明');
    expect(result.html_content).toContain('操作履歴');
    expect(result.fallback_reason).toContain('S3アップロード失敗');

    expect(mockS3Client.putObject).toHaveBeenCalledTimes(2);
    expect(mockS3Client.putObject).toHaveBeenNthCalledWith(1, reportData);
    expect(mockS3Client.putObject).toHaveBeenNthCalledWith(2, reportData);
  });
});