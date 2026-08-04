import { extractImprovementTargets } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 改善対象項目抽出', () => {
  test('SCEN-536: 改善優先度がちょうど閾値以上のときアイテムが抽出対象になる', () => {
    // Arrange
    const threshold = 70;
    const testItem = {
      id: 'improvement_001',
      name: '提案内容の顧客ニーズ適合度向上',
      improvementPriority: 70,
      category: 'proposal_quality',
      description: '提案内容と顧客ニーズのギャップを減らすための改善項目',
    };

    const testItems = [testItem];

    // Act
    const extractedTargets = extractImprovementTargets(testItems, threshold);

    // Assert
    expect(extractedTargets).toHaveLength(1);
    expect(extractedTargets[0].id).toBe('improvement_001');
    expect(extractedTargets[0].name).toBe('提案内容の顧客ニーズ適合度向上');
    expect(extractedTargets[0].improvementPriority).toBe(70);
  });
});