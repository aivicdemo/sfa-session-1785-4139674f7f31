import { detectDuplicateCustomers, classifyDuplicatePattern, normalizeAddressField, reclassifyAfterNormalization } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-538
  test('住所の不整合パターンに該当するデータが検出され、正規化ルール適用前後で分類される', () => {
    // 準備: テストデータ - 同一顧客を示す2件のレコード
    const recordA = {
      customerId: 'CUST-001',
      customerName: '株式会社テスト',
      address: '東京都渋谷区道玄坂1-2-3',
      phone: '03-1234-5678',
      registeredAt: '2024-01-10T10:00:00Z'
    };

    const recordB = {
      customerId: 'CUST-002',
      customerName: '株式会社テスト',
      address: '東京都渋谷区道玄坂1丁目2番3号',
      phone: '03-1234-5678',
      registeredAt: '2024-01-12T15:30:00Z'
    };

    // ステップ1: 重複検出エンジンに2件のレコードを入力
    const duplicateDetectionInput = {
      records: [recordA, recordB],
      detectionRules: ['address_normalization', 'phone_match', 'name_match']
    };

    const detectionResult = detectDuplicateCustomers(duplicateDetectionInput);

    // ステップ2: 住所の不整合パターンマッチング結果を確認
    expect(detectionResult.isDuplicate).toBe(true);
    expect(detectionResult.matchScore).toBeGreaterThanOrEqual(0.85);

    // ステップ3: 正規化ルール適用前の分類ステータスを記録
    const preNormalizationClassification = classifyDuplicatePattern({
      recordPair: [recordA, recordB],
      detectionResult: detectionResult,
      normalizationApplied: false
    });

    expect(preNormalizationClassification.classification).toBe('住所不整合_正規化前');
    expect(preNormalizationClassification.patternType).toBe('address_variation');
    expect(preNormalizationClassification.confidenceScore).toBeGreaterThanOrEqual(0.80);

    // ステップ4: 住所正規化ルール適用
    const normalizedRecordA = normalizeAddressField({
      address: recordA.address,
      normalizationRules: [
        'full_width_to_half_width_numbers',
        'standardize_address_separators',
        'remove_address_suffixes'
      ]
    });

    const normalizedRecordB = normalizeAddressField({
      address: recordB.address,
      normalizationRules: [
        'full_width_to_half_width_numbers',
        'standardize_address_separators',
        'remove_address_suffixes'
      ]
    });

    // ステップ5: 正規化後のレコード情報を確認
    expect(normalizedRecordA.normalizedAddress).toBe('東京都渋谷区道玄坂1-2-3');
    expect(normalizedRecordB.normalizedAddress).toBe('東京都渋谷区道玄坂1-2-3');
    expect(normalizedRecordA.normalizedAddress).toEqual(normalizedRecordB.normalizedAddress);

    // ステップ6: 正規化後の重複分類を再実行
    const recordANormalized = { ...recordA, address: normalizedRecordA.normalizedAddress };
    const recordBNormalized = { ...recordB, address: normalizedRecordB.normalizedAddress };

    const postNormalizationClassification = reclassifyAfterNormalization({
      recordPair: [recordANormalized, recordBNormalized],
      preNormalizationClassification: preNormalizationClassification,
      normalizationApplied: true
    });

    // 期待結果: 正規化ルール適用後は『確定重複』に再分類
    expect(postNormalizationClassification.classification).toBe('確定重複');
    expect(postNormalizationClassification.matchScore).toBe(1.0);
    expect(postNormalizationClassification.normalizedAddress).toBe('東京都渋谷区道玄坂1-2-3');
    expect(postNormalizationClassification.mergeCandidate).toBe(true);
    expect(postNormalizationClassification.integrationJudgmentHistoryRecord).toEqual({
      preNormalizationStatus: '住所不整合_正規化前',
      postNormalizationStatus: '確定重複',
      appliedNormalizationRules: [
        'full_width_to_half_width_numbers',
        'standardize_address_separators',
        'remove_address_suffixes'
      ],
      processedAt: expect.any(String),
      recordIds: ['CUST-001', 'CUST-002']
    });
  });
});