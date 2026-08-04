import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateRecommendationReportWithDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化 - レポートダウンロード', () => {
  let fileStorageAdapterMock: any;

  beforeEach(() => {
    fileStorageAdapterMock = null;
  });

  // SCEN-2923
  test('S3連携エラー時に利用者向けエラーメッセージを表示する', () => {
    const recommendationId = 'REC-20240115-001';
    const recommendationContent = {
      proposalApproach: '既存顧客との関係強化',
      confidenceScore: 85,
      reasoningBasis: {
        pastSuccessPatterns: ['パターンA', 'パターンB'],
        customerDataPoints: ['業種: IT', '規模: 中堅企業'],
        successFactors: ['迅速な対応', '顧客ニーズの理解']
      }
    };

    fileStorageAdapterMock = {
      generateDownloadUrl: jest.fn().mockRejectedValueOnce(
        new Error('S3_ACCESS_DENIED')
      )
    };

    const result = generateRecommendationReportWithDownloadUrl(
      recommendationId,
      recommendationContent,
      fileStorageAdapterMock
    );

    expect(result).toEqual({
      success: false,
      downloadUrl: null,
      errorMessage: 'レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください',
      fallbackAvailable: true,
      recommendationContent: recommendationContent
    });

    expect(fileStorageAdapterMock.generateDownloadUrl).toHaveBeenCalledTimes(1);
  });
});