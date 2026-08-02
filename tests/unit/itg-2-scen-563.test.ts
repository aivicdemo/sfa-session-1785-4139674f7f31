import { detectAndClassifyDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-563
  test('重複顧客データの分類結果に次ステップ推奨項目が記録される', () => {
    const inputCustomers = [
      {
        customerId: 'CUST-001',
        customerName: '株式会社ABC',
        email: 'contact@abc.com',
        phone: '03-1234-5678',
        address: '東京都渋谷区1-1-1',
      },
      {
        customerId: 'CUST-002',
        customerName: '株式会社ABC',
        email: 'sales@abc.com',
        phone: '03-1234-5678',
        address: '東京都渋谷区1-1-1',
      },
      {
        customerId: 'CUST-003',
        customerName: 'ABC株式会社',
        email: 'contact@abc.co.jp',
        phone: '03-1234-5679',
        address: '東京都渋谷区1-1-2',
      },
    ];

    const classificationResult = detectAndClassifyDuplicateCustomers(inputCustomers);

    expect(classificationResult).toBeDefined();
    expect(classificationResult.nextStepRecommendations).toBeDefined();
    expect(Array.isArray(classificationResult.nextStepRecommendations)).toBe(true);

    const duplicateGroups = classificationResult.duplicateGroups;
    expect(duplicateGroups).toBeDefined();
    expect(Array.isArray(duplicateGroups)).toBe(true);
    expect(duplicateGroups.length).toBeGreaterThan(0);

    const perfectMatchGroup = duplicateGroups.find(
      (group) => group.classificationPattern === 'PERFECT_MATCH'
    );
    expect(perfectMatchGroup).toBeDefined();
    expect(perfectMatchGroup.nextStepRecommendations).toContain('自動マージ推奨');

    const partialMatchGroup = duplicateGroups.find(
      (group) => group.classificationPattern === 'PARTIAL_MATCH'
    );
    expect(partialMatchGroup).toBeDefined();
    expect(partialMatchGroup.nextStepRecommendations).toContain('手動確認要');

    const possibleMatchGroup = duplicateGroups.find(
      (group) => group.classificationPattern === 'POSSIBLE_MATCH'
    );
    expect(possibleMatchGroup).toBeDefined();
    expect(possibleMatchGroup.nextStepRecommendations).toContain('管理者承認待ち');

    const topLevelRecommendations = classificationResult.nextStepRecommendations;
    expect(topLevelRecommendations.length).toBeGreaterThanOrEqual(1);
    expect(
      topLevelRecommendations.some(
        (rec) =>
          rec === '自動マージ推奨' ||
          rec === '手動確認要' ||
          rec === '管理者承認待ち'
      )
    ).toBe(true);

    expect(classificationResult.totalDuplicateRecords).toBe(2);
    expect(classificationResult.analysisCompletedAt).toBeDefined();
  });
});