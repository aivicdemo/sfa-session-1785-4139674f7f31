import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2284: [error] 推奨レポート生成・ファイル保存機能 - FileStorageAdapterへのアップロード失敗時、HTMLフォールバック表示に切り替わる
  test('S3アップロード失敗時、HTMLフォールバック表示に自動切り替わり、エラーメッセージは表示されない', async () => {
    // AIRecommendationEngineのスタブ
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec_001',
        customerId: 'cust_123',
        recommendedApproach: '顧客の課題に対して段階的提案を実施',
        confidenceScore: 87,
        reasoningBasis: {
          similarPatterns: [
            {
              caseId: 'case_past_001',
              matchRate: 0.92,
              successOutcome: true,
            },
          ],
          customerContext: {
            industry: '製造業',
            scale: '中堅企業',
            painPoints: ['コスト削減', 'リード時間短縮'],
          },
          successFactors: [
            'ROI明示',
            '段階導入',
            '既存システム連携',
          ],
        },
        generatedAt: new Date('2024-11-15T10:30:00Z'),
      }),
    };

    // FileStorageAdapterのスタブ（アップロード失敗を模擬、再試行2回達成後に失敗）
    let uploadAttemptCount = 0;
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockImplementation(async () => {
        uploadAttemptCount += 1;
        if (uploadAttemptCount <= 2) {
          // 再試行の条件を満たす前段階での失敗
          throw new Error('S3 upload failed');
        }
        // 2回の再試行後も失敗し続ける
        throw new Error('S3 upload failed after retries');
      }),
    };

    // 実際のテスト対象関数を呼び出し
    const result = await generateRecommendationReport(
      {
        customerId: 'cust_123',
        customerName: 'テスト顧客',
        industry: '製造業',
        scale: '中堅企業',
      },
      mockAIRecommendationEngine,
      mockFileStorageAdapter,
    );

    // 期待結果の検証：
    // 1. FileStorageAdapterへのアップロードが最大再試行回数後に失敗している
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(2);

    // 2. エラーログが出力されず、推奨内容がHTML形式で画面上に表示される
    expect(result.success).toBe(false);
    expect(result.fallbackMode).toBe(true);
    expect(result.displayFormat).toBe('html');

    // 3. HTMLフォールバック内容にはrecommendationIdと根拠情報が含まれている
    expect(result.htmlContent).toContain('rec_001');
    expect(result.htmlContent).toContain('顧客の課題に対して段階的提案を実施');
    expect(result.htmlContent).toContain('信頼度: 87');
    expect(result.htmlContent).toContain('製造業');

    // 4. ユーザー向けのエラーメッセージは表示されない
    // （代替表示に自動切り替わるため）
    expect(result.userErrorMessage).toBeUndefined();

    // 5. ブラウザの標準保存機能で取得可能な状態であることを確認
    // HTMLコンテンツがシンプルで、JavaScript実行によるダウンロード不要な構造
    expect(result.htmlContent).toMatch(/<html/i);
    expect(result.htmlContent).toMatch(/<\/html>/i);
    expect(result.browserSaveable).toBe(true);
  });
});