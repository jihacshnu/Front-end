/* eslint-disable no-await-in-loop */
/* eslint-disable react/jsx-props-no-spreading */
import { IField } from '@frontend/shared/types/form';
import userEvent from '@testing-library/user-event';
import {
  act,
  logDOM,
  render,
  within,
  screen,
  getByRole,
  prettyDOM,
} from '../../../../../jest/test-utils';
import AddField from '../AddField';

const OPTIONS = [
  {
    text: 'Form',
    value: 'form',
  },
  {
    text: 'Form Response',
    value: 'response',
  },
  {
    text: 'Text',
    value: 'text',
  },
  {
    text: 'Number',
    value: 'number',
  },
  {
    text: 'Password',
    value: 'password',
  },
  {
    text: 'Textarea',
    value: 'textarea',
  },
  {
    text: 'Rich Textarea',
    value: 'richTextarea',
  },
  {
    text: 'Boolean',
    value: 'boolean',
  },
  {
    text: 'Email',
    value: 'email',
  },
  {
    text: 'Phone Number',
    value: 'phoneNumber',
  },
  {
    text: 'Date',
    value: 'date',
  },
  {
    text: 'Date & Time',
    value: 'dateTime',
  },
  {
    text: 'Image',
    value: 'image',
  },
  {
    text: 'File',
    value: 'file',
  },
  {
    text: 'Address',
    value: 'address',
  },
  {
    text: 'Static Text',
    value: 'label',
  },
  {
    text: 'Link',
    value: 'link',
  },
  {
    text: 'Color Picker',
    value: 'colorPicker',
  },
  {
    text: 'Barcode Scanner',
    value: 'barcodeScanner',
  },
  {
    text: 'Lighthouse Report',
    value: 'lighthouseReport',
  },
  {
    text: 'Board',
    value: 'board',
  },
  {
    text: 'Diagram',
    value: 'diagram',
  },
  {
    text: 'Flow Diagram',
    value: 'flowDiagram',
  },
  {
    text: 'Condition',
    value: 'condition',
  },
] as const;

type fieldTypes = typeof OPTIONS[number]['text'];
type fieldTypeValues = typeof OPTIONS[number]['value'];

type TExtendedFieldTypes =
  | 'form'
  | 'response'
  | 'text'
  | 'number'
  | 'password'
  | 'textarea'
  | 'richTextarea'
  | 'boolean'
  | 'email'
  | 'phoneNumber'
  | 'date'
  | 'dateTime'
  | 'image'
  | 'file'
  | 'address'
  | 'label'
  | 'link'
  | 'colorPicker'
  | 'barcodeScanner'
  | 'lighthouseReport'
  | 'board'
  | 'diagram'
  | 'flowDiagram'
  | 'condition';

interface IExtendedField extends IField {
  fieldType: TExtendedFieldTypes;
}

type AppFieldProps = Parameters<typeof AddField>[0] & {
  field: IExtendedField;
  onSave: jest.Mock
};

const getAppFieldMockProps = (extra?: Partial<AppFieldProps>): AppFieldProps => {
  return {
    field: null,
    onSave: jest.fn(),
    onCancel: jest.fn(),
    ...extra,
  };
};

const getLabelNameInpGrp = () => {
  return screen.getByTestId('field-label-input-grp');
};

const getLabelNameComponent = () => {
  return screen.getByTestId('field-label');
};

const getLabelNameInpElement = (labelComponent: HTMLElement = null) => {
  let _labelComp = labelComponent;
  if (!labelComponent) _labelComp = getLabelNameComponent();
  return _labelComp.querySelector('input[name=label]') as HTMLInputElement;
};

const getFormSaveBtn = () => {
  return screen.getByTestId('form-save-btn');
};

describe('Selecting Form Field Type (label : Field Type*)', () => {
  // ---------CONSTANTS START--------------
  const TOTAL_OPTIONS = 24;
  // ---------CONSTANTS END----------------

  // ---------FUNCTIONS START-------------

  // HELPER FUNCTION TO AVOID BOILERPLATE
  /**
   * Gives the Input HTML Element
   * which has the current selected field type value eg: @type {TExtendedFieldTypes}
   * */
  const getInputElement = (SelectComponent: HTMLElement) =>
    SelectComponent.querySelector('input[name=fieldType]') as HTMLButtonElement;

  /** dont use, doesn't work properly */
  // const getLabelID = (SelectComponent: HTMLElement) =>
  //   within(SelectComponent).getByRole('button').getAttribute('aria-labelledby');

  /**
   * @returns True if this function explicitly enables ListBox
   * @returns False if if ListBox is already enabled
   */
  const makeListBoxVisible = async (SelectComponent: HTMLElement) => {
    const btn = within(SelectComponent).queryByRole('button');

    if (!btn) {
      // if button is hidden means the list box of options is enabled on the screen
      return true;
    }

    // CLICK on the button to show the list box
    await userEvent.click(btn);

    return false;
  };

  /** temporary fix to get all the options of a <Select /> component */
  const getOptionElements = async (SelectComponent: HTMLElement) => {
    const isAlreadyLBEnabled = await makeListBoxVisible(SelectComponent);

    const inputName = getInputElement(SelectComponent).getAttribute('name');
    const parentElement = document.getElementById(`menu-${inputName}`) as HTMLUListElement;
    const options = within(parentElement).getAllByRole('option') as HTMLLIElement[];

    if (!isAlreadyLBEnabled) await userEvent.click(within(SelectComponent).queryByRole('button'));

    return options;
  };

  const getSelectedValue = (SelectComponent: HTMLElement) => {
    return getInputElement(SelectComponent).value as fieldTypeValues | null;
  };

  // ---------FUNCTIONS END-------------------

  // ---------TEST CASES START-------------
  test('should be in the DOM', () => {
    const { getByTestId } = render(<AddField {...getAppFieldMockProps()} />);

    const SelectComponent = getByTestId('field-type-select');
    expect(SelectComponent).toBeInTheDocument();

    const InputLabel = getByTestId('field-type-label');
    expect(InputLabel).toBeInTheDocument();
  });

  test('to be Visible to the user', () => {
    const { getByTestId } = render(<AddField {...getAppFieldMockProps()} />);
    const SelectComponent = getByTestId('field-type-select');
    expect(SelectComponent).toBeVisible();
  });

  test(`should be Enabled`, () => {
    const { getByTestId } = render(<AddField {...getAppFieldMockProps()} />);

    const SelectComponent = getByTestId('field-type-select');
    const inputElement = getInputElement(SelectComponent);

    expect(inputElement).toBeEnabled();
  });

  test('Label Name should be = `Field Type*`', () => {
    const { getByTestId } = render(<AddField {...getAppFieldMockProps()} />);
    const InputLabel = getByTestId('field-type-label');
    expect(InputLabel).toHaveTextContent('Field Type*');
  });

  test('should be Focusable on click', async () => {
    const { getByTestId } = render(<AddField {...getAppFieldMockProps()} />);

    const SelectComponent = getByTestId('field-type-select');

    const user = userEvent.setup();
    await user.click(SelectComponent);

    const ClickableBtn = within(SelectComponent).getByRole('button');
    expect(ClickableBtn).toHaveFocus();
  });

  test(`should have labelId prop on (MUI <Select/>)`, async () => {
    const { getByTestId } = render(<AddField {...getAppFieldMockProps()} />);
    const SelectComponent = getByTestId('field-type-select');
    const ClickableBtn = within(SelectComponent).getByRole('button');
    expect(ClickableBtn).not.toHaveAttribute('aria-labelledby', null);
  });

  test('should not have any default value selected', () => {
    const { getByTestId } = render(<AddField {...getAppFieldMockProps()} />);

    const SelectComponent = getByTestId('field-type-select');
    const selectedField = getSelectedValue(SelectComponent);
    expect(selectedField).toBeFalsy();
  });

  test('should have 24 types of fields', async () => {
    const { getByTestId } = render(<AddField {...getAppFieldMockProps()} />);

    const SelectComponent = getByTestId('field-type-select');
    const options = await getOptionElements(SelectComponent);

    expect(options).toHaveLength(TOTAL_OPTIONS);
  });

  test.skip('is required', () => {
    throw new Error(' TODO');
  });

  describe('Field Type Options', () => {
    test.each(OPTIONS)(
      `Option of '$text' should be present with value of '$value' and it should be selectable`,
      async (optionData) => {
        const { getByTestId } = render(<AddField {...getAppFieldMockProps()} />);

        const SelectComponent = getByTestId('field-type-select');
        const options = await getOptionElements(SelectComponent);

        const optionElement = options.find((ele) => ele.textContent === optionData.text);

        if (!optionElement) {
          throw new Error(`Expected Option : ${optionData.text} \n Got ${optionElement}`);
        }

        expect(optionElement).toHaveTextContent(optionData.text);
        // checking indirectly, dont use
        // expect(optionElement).toHaveAttribute('data-value', optionData.value);

        const user = userEvent.setup();
        await user.click(optionElement);

        const selectedvalue = getSelectedValue(SelectComponent);
        expect(selectedvalue).toBe(optionData.value);
      },
    );
  });

  describe('Field Attributes', () => {
    const selectFieldTypeOption = async (fieldType: fieldTypes, SelectComponent: HTMLElement) => {
      await makeListBoxVisible(SelectComponent);
      const options = await getOptionElements(SelectComponent);
      const optionElement = options.find((ele) => ele.textContent === fieldType);

      const user = userEvent.setup();
      await user.click(optionElement);
    };

    describe('common attributes', () => {
      const COMMON_ATTRIBUTES = [
        {
          text: 'Required',
          testid: 'required-field-attribute',
          // name is the <Checkbox name='$name'/> attribute
          name: 'required',
        },
        {
          text: 'Multiple values',
          testid: 'multiple-value-attribute',
          name: 'multipleValues',
        },
        {
          text: 'Unique',
          testid: 'unique-attribute',
          name: 'unique',
        },
        {
          text: 'Show comment box',
          testid: 'show-comment-box-attribute',
          name: 'showCommentBox',
        },
        {
          text: 'Show star rating',
          testid: 'show-star-rating-attribute',
          name: 'showStarRating',
        },
        {
          text: 'Response not editable',
          testid: 'response-not-editable-attribute',
          name: 'notEditable',
        },
        {
          text: 'System calculated & saved',
          testid: 'sys-calc&saved-attribute',
          name: 'systemCalculatedAndSaved',
        },
        {
          text: 'System calculated & view',
          testid: 'sys-cal&view-attribute',
          name: 'systemCalculatedAndView',
        },
      ] as const;

      test.each(COMMON_ATTRIBUTES)(`basic checks for '$text' Attribute`, (attr) => {
        const { getByTestId } = render(<AddField {...getAppFieldMockProps()} />);

        const reqAttrEle = getByTestId(attr.testid);
        // im assuming eveything is a checkbox
        const innerCheckBox = reqAttrEle.querySelector('input[type="checkbox"]');

        expect(reqAttrEle).toBeVisible();
        expect(innerCheckBox).toBeEnabled();
        expect(innerCheckBox).toHaveAttribute('name', attr.name);
      });
    });
  });

  // ---------TEST CASES END-------------
});

describe("Field's Label Name (label : Label*)", () => {
  // ---------TEST CASES START-------------
  test('to be in the DOM', () => {
    render(<AddField {...getAppFieldMockProps()} />);
    const labelComponent = getLabelNameComponent();
    expect(labelComponent).toBeInTheDocument();
  });

  test('to be visible', () => {
    render(<AddField {...getAppFieldMockProps()} />);
    const labelComponent = getLabelNameComponent();
    expect(labelComponent).toBeVisible();
  });

  test('to be Enabled', () => {
    render(<AddField {...getAppFieldMockProps()} />);
    const innerInput = getLabelNameInpElement();
    expect(innerInput).toBeEnabled();
  });

  test(`should have Input Components's Label Name as Label*`, () => {
    render(<AddField {...getAppFieldMockProps()} />);
    const labelComponent = getLabelNameComponent().querySelector('label');
    expect(labelComponent).toHaveTextContent('Label*');
  });

  test('should have appropriate attributes', () => {
    render(<AddField {...getAppFieldMockProps()} />);
    const innerInput = getLabelNameInpElement();
    expect(innerInput).toHaveAttribute('type', 'text');
    expect(innerInput).toHaveAttribute('name', 'label');
  });

  test('should be auto focusable & blurable on click', async () => {
    const { getByTestId } = render(
      <>
        <AddField {...getAppFieldMockProps()} />
        <input type="text" data-testid="diff-inp" />
      </>,
    );
    const innerInput = getLabelNameInpElement();
    expect(innerInput).toHaveFocus();

    const user = userEvent.setup();

    // SIMULATING CLIKING SOMEWHERE ELSE
    await user.click(getByTestId('diff-inp'));

    expect(innerInput).not.toHaveFocus();
  });

  test(`should have a default value = ''`, () => {
    render(<AddField {...getAppFieldMockProps()} />);
    const innerInput = getLabelNameInpElement();
    const DEFAULT_VALUE = '';
    expect(innerInput).toHaveValue(DEFAULT_VALUE);
  });

  // not working, saveBtn is the form submit button, which is not working
  test.skip('is required', async () => {
    render(<AddField {...getAppFieldMockProps()} />);

    const saveBtn = getFormSaveBtn();
    const innerInput = getLabelNameInpElement();
    const user = userEvent.setup();

    // default value is cleared
    await user.clear(innerInput);

    // try to save the form with
    await user.click(saveBtn);

    expect(innerInput).toHaveAccessibleDescription(/required/i);
  });

  test('(important) should be able to enter a label name', async () => {
    render(<AddField {...getAppFieldMockProps()} />);

    const labelComponent = getLabelNameComponent();
    const innerInput = getLabelNameInpElement(labelComponent);
    const user = userEvent.setup();

    await user.click(labelComponent);

    // CLEAR DEFAULT INPUT
    // await act(() => user.clear(innerInput)); // gives issues
    await user.clear(innerInput);

    // TODO: add more kinds of test cases for better validation!
    const TEST_INPUTS = [
      {
        type: 'label',
        expect: 'label',
      },
      {
        type: 'LABEL',
        expect: 'LABEL',
      },
      {
        type: 'Label123',
        expect: 'Label123',
      },
      {
        type: '!@#',
        expect: '!@#',
      },
    ];

    for (let i = 0; i < TEST_INPUTS.length; i += 1) {
      const test = TEST_INPUTS[Number(i)];

      expect(innerInput).toHaveValue('');
      await user.type(innerInput, test.type);
      expect(innerInput).toHaveValue(test.expect);
      await user.clear(innerInput);
    }
  });

  // ---------TEST CASES END-------------
});

describe('Form Save Button', () => {
  test('is enabled', () => {
    const { getByTestId } = render(<AddField {...getAppFieldMockProps()} />);

    const FormSaveBtn = getFormSaveBtn();

    // console.debug('enabled', prettyDOM(FormSaveBtn));

    expect(FormSaveBtn).toBeEnabled();
  });

  test('to be visible', () => {
    const { getByTestId } = render(<AddField {...getAppFieldMockProps()} />);
    const FormSaveBtn = getFormSaveBtn();
    expect(FormSaveBtn).toBeVisible();
  });

  describe('form should not be submitted', () => {
    test.only('if label name is empty', async () => {
      const mockProps = getAppFieldMockProps();

      render(<AddField {...mockProps} />);

      const labelLabelNameComp = getLabelNameComponent();
      const labelNameInputEle = getLabelNameInpElement();
      const FormSaveBtn = getFormSaveBtn();

      const user = userEvent.setup();

      // default input should be removed
      await user.clear(labelNameInputEle);

      console.debug('before click', prettyDOM(getLabelNameInpGrp()));
      await user.click(FormSaveBtn);

      console.debug('after click', prettyDOM(getLabelNameInpGrp()));
      console.debug('ac', mockProps.onSave.)
    });
  });
});
