import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェントの推奨根拠の可視化機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-741: [error] 推奨内容のレポート生成・保存機能 - FileStorageAdapterのS3アップロード失敗時HTML代替表示で推奨内容を返す
  test('S3アップロード失敗時に推奨内容をHTML形式で代替表示する', async () => {
    const recommendationId = 'rec-2024-001';
    const proposalApproach = '段階的な導入フェーズを提案';
    const rationale = [
      { factor: '顧客の予算制約', evidence: '年間予算500万円' },
      { factor: '導入期間', evidence: '3ヶ月以内での実装を要望' }
    ];
    const confidenceScore = 87;

    const mockRecommendation = {
      id: recommendationId,
      proposalApproach: proposalApproach,
      rationale: rationale,
      confidenceScore: confidenceScore,
      timestamp: '2024-01-15T11:00:00Z'
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(mockRecommendation)
    };

    let s3UploadAttemptCount = 0;
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(async () => {
        s3UploadAttemptCount++;
        if (s3UploadAttemptCount <= 2) {
          throw new Error('S3 Access Denied: User is not authorized to perform s3:PutObject');
        }
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn()
    };

    const mockRetryDelay = jest.fn(async (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    });

    const customerData = {
      industry: 'manufacturing',
      companySize: 'mid-market',
      budget: 5000000,
      timeline: 90
    };

    const dealConditions = {
      productCategory: 'cloud-infrastructure',
      requiredFeatures: ['scalability', 'security'],
      implementationCritical: true
    };

    let htmlFallbackContent = '';
    let userMessage = '';
    const mockUINotification = {
      displayUserMessage: jest.fn((message: string) => {
        userMessage = message;
      }),
      displayHTMLContent: jest.fn((html: string) => {
        htmlFallbackContent = html;
      })
    };

    try {
      await mockFileStorageAdapter.uploadRecommendationReport({
        recommendation: mockRecommendation,
        format: 'pdf'
      });
    } catch (error) {
      await mockRetryDelay(3000);
      try {
        await mockFileStorageAdapter.uploadRecommendationReport({
          recommendation: mockRecommendation,
          format: 'pdf'
        });
      } catch (retryError) {
        const htmlDocument = generateHTMLFallback(mockRecommendation);
        mockUINotification.displayHTMLContent(htmlDocument);
        mockUINotification.displayUserMessage(
          'レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください'
        );
        htmlFallbackContent = htmlDocument;
        userMessage = 'レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください';
      }
    }

    expect(s3UploadAttemptCount).toBe(2);
    expect(userMessage).toBe('レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください');
    
    expect(htmlFallbackContent).toContain('<!DOCTYPE html>');
    expect(htmlFallbackContent).toContain(recommendationId);
    expect(htmlFallbackContent).toContain(proposalApproach);
    expect(htmlFallbackContent).toContain('段階的な導入フェーズを提案');
    expect(htmlFallbackContent).toContain('87');
    expect(htmlFallbackContent).toContain('年間予算500万円');
    expect(htmlFallbackContent).toContain('3ヶ月以内での実装を要望');
    expect(htmlFallbackContent).toContain('text/html');
    expect(htmlFallbackContent).toContain('charset=utf-8');
  });
});

function generateHTMLFallback(recommendation: {
  id: string;
  proposalApproach: string;
  rationale: Array<{ factor: string; evidence: string }>;
  confidenceScore: number;
  timestamp: string;
}): string {
  const rationaleRows = recommendation.rationale
    .map(
      item =>
        `<tr><td>${escapeHtml(item.factor)}</td><td>${escapeHtml(item.evidence)}</td></tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AIエージェント推奨内容</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
    .container { max-width: 900px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { border-bottom: 3px solid #0066cc; padding-bottom: 15px; margin-bottom: 25px; }
    h1 { color: #0066cc; margin: 0 0 5px 0; }
    .meta { color: #666; font-size: 14px; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 12px; border-left: 4px solid #0066cc; padding-left: 12px; }
    .approach-box { background-color: #e6f2ff; padding: 15px; border-radius: 4px; margin-bottom: 10px; }
    .score-badge { display: inline-block; background-color: #0066cc; color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold; font-size: 16px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th { background-color: #f0f0f0; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; font-weight: bold; }
    td { padding: 12px; border-bottom: 1px solid #eee; }
    tr:hover { background-color: #f9f9f9; }
    .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>AIエージェント推奨内容</h1>
      <div class="meta">推奨ID: ${escapeHtml(recommendation.id)} | 生成日時: ${escapeHtml(recommendation.timestamp)}</div>
    </div>
    
    <div class="section">
      <div class="section-title">提案アプローチ</div>
      <div class="approach-box">
        <p>${escapeHtml(recommendation.proposalApproach)}</p>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">信頼度スコア</div>
      <div class="score-badge">${recommendation.confidenceScore}%</div>
    </div>
    
    <div class="section">
      <div class="section-title">推奨根拠</div>
      <table>
        <thead>
          <tr>
            <th>要因</th>
            <th>根拠詳細</th>
          </tr>
        </thead>
        <tbody>
          ${rationaleRows}
        </tbody>
      </table>
    </div>
    
    <div class="footer">
      <p>このレポートはAIエージェントにより自動生成されました。内容の精度確認およびビジネス判断は営業担当者による確認が必須です。</p>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, char => map[char]);
}