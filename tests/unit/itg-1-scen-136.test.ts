import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  test('SCEN-136: 判定基準の条件式がシステム実装不可能な形式の場合、変換処理がエラーになる', () => {
    const invalidConditionExpression = '(A AND B) OR (C XOR D) AND';
    const processStandardInput = {
      processName: 'standard_sales_process',
      stages: [
        {
          stageName: 'initial_contact',
          description: 'First customer contact',
        },
        {
          stageName: 'proposal',
          description: 'Submit proposal to customer',
        },
      ],
      decisionCriteria: {
        conditionExpression: invalidConditionExpression,
        threshold: 0.75,
      },
      dataItems: ['customer_name', 'contact_date', 'proposal_content'],
    };

    expect(() => {
      convertProcessStandardToSystemRequirements(processStandardInput);
    }).toThrow(/INVALID_CONDITION_FORMAT/);
  });
});