import { validateProcessRequirementImplementability } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書システム要件変換と実装可能性検証', () => {
  // SCEN-139
  test('プロセス標準書から変換された要件仕様のシステム実装可能性が検証される', () => {
    const processRequirement = {
      requirementId: 'REQ-001',
      description: '営業担当者は顧客情報入力後、自動で見積もり生成ボタンが活性化される',
      processStage: 'estimate_generation',
      dataFields: [
        'customer_id',
        'product_category',
        'quantity',
        'discount_rate'
      ],
      triggerCondition: 'all_mandatory_fields_completed',
      expectedOutput: 'estimate_button_enabled',
      systemDependencies: [
        'customer_master_table',
        'product_master_table',
        'estimate_api'
      ],
      performanceRequirement: {
        responseTimeMs: 500,
        concurrentUsers: 100
      }
    };

    const result = validateProcessRequirementImplementability(processRequirement);

    expect(result.implementabilityScore).toBeGreaterThanOrEqual(70);
    expect(result.implementabilityScore).toBeLessThanOrEqual(100);
    
    expect(Array.isArray(result.implementationIssues)).toBe(true);
    expect(result.implementationIssues.length).toBeLessThanOrEqual(3);
    
    result.implementationIssues.forEach((issue) => {
      expect(typeof issue).toBe('string');
      expect(issue.length).toBeGreaterThan(0);
    });

    expect(Array.isArray(result.recommendedApproaches)).toBe(true);
    expect(result.recommendedApproaches.length).toBeGreaterThan(0);
    
    result.recommendedApproaches.forEach((approach) => {
      expect(typeof approach).toBe('string');
      expect(approach.length).toBeGreaterThan(0);
    });

    expect(result.implementationIssues).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/データベース設計/),
        expect.stringMatching(/API連携仕様/)
      ])
    );

    expect(result.recommendedApproaches).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/既存マスタテーブル/),
        expect.stringMatching(/REST API設計/)
      ])
    );

    expect(result.requirementId).toBe('REQ-001');
    expect(result.validationTimestamp).toBeDefined();
    expect(typeof result.validationTimestamp).toBe('string');
  });
});