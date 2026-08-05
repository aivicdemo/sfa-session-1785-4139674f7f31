import { determinePriorityForImprovementGuidance } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-218: 遵守度スコアが最も低い営業担当者が改善指導の最優先対象として判定される', () => {
    // Arrange
    const salesRepresentatives = [
      {
        salesRepId: 'SR001',
        name: '営業担当者A',
        complianceScore: 65,
      },
      {
        salesRepId: 'SR002',
        name: '営業担当者B',
        complianceScore: 45,
      },
      {
        salesRepId: 'SR003',
        name: '営業担当者C',
        complianceScore: 78,
      },
    ];

    // Act
    const result = determinePriorityForImprovementGuidance(salesRepresentatives);

    // Assert
    expect(result.priorityTarget.salesRepId).toBe('SR002');
    expect(result.priorityTarget.name).toBe('営業担当者B');
    expect(result.priorityTarget.complianceScore).toBe(45);
  });
});