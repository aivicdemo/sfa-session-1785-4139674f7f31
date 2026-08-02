import { extractRelatedCasesByApproach } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-646
  test('推奨アプローチに関連する過去事例が1件のとき、その事例データが正しく抽出される', () => {
    const pastCases = [
      {
        caseId: 'CASE-2024-001',
        projectName: 'A社向け提案',
        contractAmount: 5000000,
        implementationDate: '2024-01-15',
        approach: '顧客セグメント分析',
      },
    ];

    const selectedApproach = '顧客セグメント分析';

    const result = extractRelatedCasesByApproach(pastCases, selectedApproach);

    expect(result).toHaveLength(1);
    expect(result[0].caseId).toBe('CASE-2024-001');
    expect(result[0].projectName).toBe('A社向け提案');
    expect(result[0].contractAmount).toBe(5000000);
    expect(result[0].implementationDate).toBe('2024-01-15');
  });
});