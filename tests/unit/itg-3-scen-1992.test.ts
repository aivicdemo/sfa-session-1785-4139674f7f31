import { generateExecutivePersuasionDocument } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1992
  test('経営層向け説得資料の自動生成機能 - 投資対効果情報が未設定（null）のとき、資料生成がエラーになる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValueOnce({
        code: 'VALIDATION_ERROR',
        message: '投資対効果情報（投資額、導入コスト、効果額、ROI）は必須項目です。nullの値は許可されません',
        details: {
          invalidFields: ['investmentROI', 'implementationCost', 'annualEffectAmount', 'implementationPeriod']
        }
      })
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn()
    };

    const customerInfo = {
      name: 'ABC Corporation',
      industry: 'Manufacturing',
      scale: 'Large'
    };

    const proposalContent = {
      service: 'Enterprise Resource Planning System',
      implementationEffect: 'Process automation and cost reduction'
    };

    const investmentInfo = {
      investmentROI: null,
      implementationCost: null,
      annualEffectAmount: null,
      implementationPeriod: null
    };

    const result = generateExecutivePersuasionDocument(
      customerInfo,
      proposalContent,
      investmentInfo,
      mockAIEngine,
      mockFileStorage
    );

    expect(result).toEqual({
      status: 'ERROR',
      errorCode: 'VALIDATION_ERROR',
      errorMessage: '投資対効果情報（投資額、導入コスト、効果額、ROI）は必須項目です。nullの値は許可されません',
      invalidFields: ['investmentROI', 'implementationCost', 'annualEffectAmount', 'implementationPeriod'],
      documentGenerated: false,
      metadataRecorded: false
    });

    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});