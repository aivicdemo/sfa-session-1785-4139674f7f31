import { detectAndClassifyDuplicates } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-551
  test('重複候補の企業名が空文字のとき、企業名に基づく分類ができないと記録される', () => {
    const duplicateCandidates = [
      {
        recordId: 'REC-001',
        companyName: '株式会社ABC',
        representativeName: '山田太郎',
        phoneNumber: '03-1234-5678',
        address: '東京都渋谷区',
      },
      {
        recordId: 'REC-002',
        companyName: '',
        representativeName: '田中花子',
        phoneNumber: '03-1234-5678',
        address: '東京都渋谷区',
      },
    ];

    const result = detectAndClassifyDuplicates(duplicateCandidates);

    expect(result.classificationResults).toHaveLength(1);
    expect(result.classificationResults[0]).toEqual({
      recordPairId: 'REC-001_REC-002',
      recordIdA: 'REC-001',
      recordIdB: 'REC-002',
      classificationStatus: 'スキップ',
      classificationBasis: '企業名',
      classificationMessage: '企業名が空のため分類不可',
      isClassifiable: false,
      detectedIssues: expect.arrayContaining([
        expect.objectContaining({
          issueType: '企業名欠損',
          severity: 'high',
          affectedRecordId: 'REC-002',
        }),
      ]),
    });

    expect(result.overallStatus).toBe('partial_failure');
    expect(result.totalRecordPairs).toBe(1);
    expect(result.successfulClassifications).toBe(0);
    expect(result.failedClassifications).toBe(1);
  });
});