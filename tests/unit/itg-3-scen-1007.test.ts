import { describe, test, expect, beforeEach } from '@jest/globals';
import { validateProposalGenerationPrerequisites } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 提案資料生成処理の前提条件検証', () => {
  // SCEN-1007
  test('商談内容が未入力の場合、警告メッセージが表示される', () => {
    const inputData = {
      customerName: '株式会社サンプル',
      industry: 'IT',
      companySize: '101-500',
      dealContent: '',
      dealStatus: 'initial_contact'
    };

    const result = validateProposalGenerationPrerequisites(inputData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'dealContent',
          message: '商談内容は必須入力項目です'
        })
      ])
    );
    expect(result.focusField).toBe('dealContent');
    expect(result.shouldCallAIEngine).toBe(false);
  });
});