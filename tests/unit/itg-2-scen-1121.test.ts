import { validateBusinessDataFormat } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1121
  test('事例データのテキスト長が上限に達している場合、形式検証に合格する', () => {
    const maxLengthText = 'a'.repeat(5000);
    
    const caseDataInput = {
      caseTitle: '成功事例001',
      caseDescription: maxLengthText,
      caseOutcome: '売上向上',
      caseAmount: 1500000,
      caseDate: '2024-01-15',
    };

    const validationResult = validateBusinessDataFormat(caseDataInput);

    expect(validationResult.validationStatus).toBe('PASSED');
    expect(validationResult.errorCount).toBe(0);
    expect(validationResult.warningCount).toBe(0);
  });
});