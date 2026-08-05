import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  test('SCEN-195: プロセス段階数が標準化可能な上限値(10段階)のとき、全段階が要件仕様に変換される', () => {
    // Arrange
    const processStandardInput = {
      processId: 'proc_001',
      processName: '営業プロセス標準書',
      totalStages: 10,
      stages: [
        {
          stageNumber: 1,
          stageName: '初回接触',
          ownerRole: '営業担当者',
          executionCondition: '見込み客を特定した時点',
          deliverable: '初回接触記録'
        },
        {
          stageNumber: 2,
          stageName: '顧客ニーズ把握',
          ownerRole: '営業担当者',
          executionCondition: '初回接触完了後1営業日以内',
          deliverable: 'ニーズ調査票'
        },
        {
          stageNumber: 3,
          stageName: '提案準備',
          ownerRole: '営業担当者',
          executionCondition: 'ニーズ把握完了後2営業日以内',
          deliverable: '提案資料案'
        },
        {
          stageNumber: 4,
          stageName: '提案実施',
          ownerRole: '営業担当者',
          executionCondition: '提案準備完了後3営業日以内',
          deliverable: '提案実施記録'
        },
        {
          stageNumber: 5,
          stageName: '顧客反応確認',
          ownerRole: '営業担当者',
          executionCondition: '提案実施後1営業日以内',
          deliverable: '顧客反応記録'
        },
        {
          stageNumber: 6,
          stageName: '交渉開始',
          ownerRole: '営業管理職',
          executionCondition: '顧客から前向き反応を受領後1営業日以内',
          deliverable: '交渉議題リスト'
        },
        {
          stageNumber: 7,
          stageName: '条件調整',
          ownerRole: '営業管理職',
          executionCondition: '交渉開始後、双方合意まで継続',
          deliverable: '条件調整記録'
        },
        {
          stageNumber: 8,
          stageName: '最終承認取得',
          ownerRole: '営業部長',
          executionCondition: '条件調整完了後1営業日以内',
          deliverable: '承認決裁'
        },
        {
          stageNumber: 9,
          stageName: '成約手続き',
          ownerRole: '営業事務',
          executionCondition: '最終承認取得後2営業日以内',
          deliverable: '契約書'
        },
        {
          stageNumber: 10,
          stageName: 'フォローアップ開始',
          ownerRole: '営業担当者',
          executionCondition: '成約手続き完了後1営業日以内',
          deliverable: 'フォローアップ計画'
        }
      ]
    };

    // Act
    const result = convertProcessStandardToSystemRequirements(processStandardInput);

    // Assert
    expect(result.conversionStatus).toBe('success');
    expect(result.systemRequirements).toBeDefined();
    expect(result.systemRequirements.length).toBe(10);

    // 各段階が正しく変換されていることを確認
    result.systemRequirements.forEach((requirement, index) => {
      const expectedStageNumber = index + 1;
      expect(requirement.stageNumber).toBe(expectedStageNumber);
      expect(requirement.stageName).toBeDefined();
      expect(requirement.stageName.length).toBeGreaterThan(0);
      expect(requirement.ownerRole).toBeDefined();
      expect(requirement.ownerRole.length).toBeGreaterThan(0);
      expect(requirement.executionCondition).toBeDefined();
      expect(requirement.executionCondition.length).toBeGreaterThan(0);
      expect(requirement.deliverable).toBeDefined();
      expect(requirement.deliverable.length).toBeGreaterThan(0);
    });

    // 第1段階の具体的な要件仕様を確認
    expect(result.systemRequirements[0].stageName).toBe('初回接触');
    expect(result.systemRequirements[0].ownerRole).toBe('営業担当者');
    expect(result.systemRequirements[0].executionCondition).toBe('見込み客を特定した時点');
    expect(result.systemRequirements[0].deliverable).toBe('初回接触記録');

    // 第10段階の具体的な要件仕様を確認
    expect(result.systemRequirements[9].stageName).toBe('フォローアップ開始');
    expect(result.systemRequirements[9].ownerRole).toBe('営業担当者');
    expect(result.systemRequirements[9].executionCondition).toBe('成約手続き完了後1営業日以内');
    expect(result.systemRequirements[9].deliverable).toBe('フォローアップ計画');

    // 変換処理の詳細情報を確認
    expect(result.processId).toBe('proc_001');
    expect(result.processName).toBe('営業プロセス標準書');
    expect(result.totalStagesConverted).toBe(10);
    expect(result.conversionTimestamp).toBeDefined();
  });
});