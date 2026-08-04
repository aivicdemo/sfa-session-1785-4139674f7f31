import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { decideGuidanceStrategy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 指導方針決定機能', () => {
  let aiEngineStub: jest.Mock;
  let fileStorageStub: jest.Mock;

  beforeEach(() => {
    aiEngineStub = jest.fn();
    fileStorageStub = jest.fn();
  });

  // SCEN-504
  test('指導対象項目が空配列のとき、ValidationErrorをスロー', () => {
    const salesPersonId = 'SP001';
    const dealInfo = {
      dealId: 'DEAL20240115001',
      customerName: 'テスト顧客',
      dealAmount: 5000000,
      dealStage: 'proposal',
    };
    const guidanceItems: string[] = [];

    expect(() => {
      decideGuidanceStrategy(
        salesPersonId,
        dealInfo,
        guidanceItems,
        { generateRecommendation: aiEngineStub } as any,
        { uploadRecommendationReport: fileStorageStub } as any
      );
    }).toThrow(/guidanceItems/);

    expect(aiEngineStub).not.toHaveBeenCalled();
    expect(fileStorageStub).not.toHaveBeenCalled();
  });
});