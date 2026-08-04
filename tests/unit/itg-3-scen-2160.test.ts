import { generateRecommendationReportWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  test('SCEN-2160: [error] 推奨レポートのPDF/Excel生成 - FileStorageAdapter.uploadRecommendationReport が外部API呼び出しで失敗したとき、HTML形式で画面表示される', async () => {
    // Arrange: テストデータ準備
    const recommendationData = {
      proposalApproach: '顧客の経営課題に基づいた段階的な導入提案',
      groundingEvidence: ['過去案件A：同業種、同規模、成約率92%', '過去案件B：類似課題、成約率85%'],
      similarPatterns: [
        { caseId: 'CASE-001', matchingScore: 92, description: '同業種・同規模の成功案件' },
        { caseId: 'CASE-002', matchingScore: 85, description: '類似経営課題の成功案件' },
      ],
      confidenceScore: 88,
    };

    const uploadAttempts: number[] = [];
    let retryCount = 0;

    const stubFileStorageAdapter = {
      uploadRecommendationReport: async () => {
        uploadAttempts.push(Date.now());
        retryCount++;
        // 最初と2回目の再試行で失敗させる（合計2回の再試行）
        throw new Error('S3 upload failed: 403 Forbidden');
      },
    };

    // Act: 関数を実行（再試行ロジック付き）
    const result = await generateRecommendationReportWithFallback(
      recommendationData,
      stubFileStorageAdapter
    );

    // Assert: HTML形式で代替表示されることを確認
    expect(result).toBeDefined();
    expect(result.format).toBe('html');
    expect(typeof result.htmlContent).toBe('string');
    expect(result.htmlContent.length).toBeGreaterThan(0);

    // (1)推奨内容の本体が含まれていることを確認
    expect(result.htmlContent).toContain('顧客の経営課題に基づいた段階的な導入提案');
    expect(result.htmlContent).toContain('過去案件A');
    expect(result.htmlContent).toContain('成約率92%');
    expect(result.htmlContent).toContain('CASE-001');
    expect(result.htmlContent).toContain('同業種・同規模の成功案件');
    expect(result.htmlContent).toContain('88');

    // (2)ブラウザのネイティブ保存機能が使用可能な状態を確認
    // HTML形式として有効な構造を持つことを確認
    expect(result.htmlContent).toMatch(/<html/i);
    expect(result.htmlContent).toMatch(/<\/html>/i);
    expect(result.htmlContent).toMatch(/<body/i);
    expect(result.htmlContent).toMatch(/<\/body>/i);

    // (3)ファイルアップロード失敗の再試行が合計2回実行されたことを確認
    expect(uploadAttempts.length).toBe(3); // 初回1回 + 再試行2回 = 3回
    expect(retryCount).toBe(3);

    // (4)エラーメッセージが存在しないことを確認（HTML表示が代替動作）
    expect(result.errorMessage).toBeUndefined();
    expect(result.htmlContent).not.toMatch(/レポート生成に失敗しました/);
    expect(result.htmlContent).not.toMatch(/エラーが発生しました/);

    // (5)confidenceScore も HTML に含まれることを確認
    expect(result.htmlContent).toContain('信頼度');
  });
});