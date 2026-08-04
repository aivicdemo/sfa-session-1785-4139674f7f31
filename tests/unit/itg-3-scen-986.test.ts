import { generateAndSaveReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - レポート生成・保存', () => {
  // SCEN-986
  test('推奨内容が null のとき、レポート生成処理が開始されず警告が返される', () => {
    const uploadRecommendationReportStub = jest.fn();

    const fileStorageAdapterStub = {
      uploadRecommendationReport: uploadRecommendationReportStub,
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const recommendationContent = null;
    const userId = 'user_12345';
    const dealId = 'deal_67890';

    const result = generateAndSaveReport(
      recommendationContent,
      userId,
      dealId,
      fileStorageAdapterStub
    );

    expect(result).toEqual({
      success: false,
      errorCode: 'INVALID_RECOMMENDATION_CONTENT',
      message: '推奨内容が空です。レポート生成を実行できません',
    });

    expect(uploadRecommendationReportStub).toHaveBeenCalledTimes(0);
  });
});