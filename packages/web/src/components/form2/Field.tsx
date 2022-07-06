import { useState } from 'react';
import moment from 'moment';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import AdapterMoment from '@mui/lab/AdapterMoment';
import DateTimePicker from '@mui/lab/DateTimePicker';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { useCheckUnique } from '@frontend/shared/hooks/response';
import PhoneInput from 'react-phone-input-2';
import { validateValue } from '@frontend/shared/utils/validate';
import { IFieldOptions } from '@frontend/shared/types/form';
import RichTextarea from '../common/RichTextarea2';
import DisplayRichText from '../common/DisplayRichText';
import SelectResponse from '../response/SelectResponse';
import Select from './Select';
import SelectForm from './SelectForm';
import ImagePicker2 from '../common/ImagePicker2';
import ColorInput from '../customMUI/ColorInput/ColorInput';
import AddressSearch from '../common/AddressSearch';
import BarcodeInput from '../customMUI/BarcodeInput/BarcodeInput';
import CreateResponseDrawer from '../response/CreateResponseDrawer';
import FileUpload from '../fileLibrary/FileUpload';
import DisplayFiles from '../fileLibrary/DisplayFiles';
import { onAlert } from '../../utils/alert';

import 'react-phone-input-2/lib/style.css';
import Response from '../response/Response';
import UnitQuantityInput from './UnitQuantityInput';
import Board from './board/Board';
import { defaultBoard } from './board/defaultBoard';
import Diagram from '../syncfusion-diagram/Diagram';
import { defaultDiagram } from '../syncfusion-diagram/defaultDiagram';
import ReactFlow from '../react-flow/ReactFlow';

interface IProps {
  disabled?: boolean;
  validate: boolean;
  _id: string;
  label: string;
  fieldType: string;
  template: any;
  options: Partial<IFieldOptions>;
  value: any;
  onChangeValue: (arg: any) => void;
  mediaState: any;
  setMediaState: any;
  form: any;
  formId?: any;
  setUnique: any;
  responseId?: string;
  setUniqueLoading?: (args: boolean) => void;
}

export default function Field({
  disabled = false,
  validate,
  _id,
  label,
  fieldType,
  template,
  options,
  value,
  onChangeValue,
  form,
  formId,
  setUnique,
  responseId,
  setUniqueLoading,
}: IProps): any {
  useCheckUnique({ formId, value, options, setUnique, onAlert, responseId, setUniqueLoading });

  const onChange = (payload) => {
    // debugger;
    onChangeValue({ ...value, field: _id, ...payload });
    if (options?.unique) {
      setUnique(false);
      setUniqueLoading(true);
    }
  };

  const [addOption, setAddOption] = useState({ showDrawer: false });

  const onChangeCheckbox = ({ target }) => {
    let newValues = [];
    if (value.values) {
      newValues = [...value.values];
    }
    if (target.checked && !newValues.includes(target.name)) {
      newValues.push(target.name);
    } else {
      newValues.splice(newValues.indexOf(target.name), 1);
    }
    onChange({ values: newValues });
  };

  const validation = validateValue(validate, value, { options, fieldType, template, form });

  if (options.selectItem && fieldType !== 'form') {
    return (
      <>
        {fieldType === 'response' ? (
          <SelectResponse
            label={`${label} response`}
            formId={form?._id}
            formField={options?.formField}
            value={value?.response}
            onChange={(newValue) => onChange({ field: _id, response: newValue })}
            error={validation.error}
            helperText={validation.errorMessage}
            allowCreate={options?.selectAllowCreate}
            onlyMyResponses={options?.showOptionCreatedByUser}
          />
        ) : options?.showAsCheckbox ? (
          <>
            {options?.selectOptions?.map((option, i) => (
              <FormControlLabel
                disabled={disabled}
                key={i}
                control={
                  <Checkbox
                    name={option}
                    checked={value?.values?.includes(option)}
                    onChange={onChangeCheckbox}
                  />
                }
                label={option}
              />
            ))}
            {validation.error && (
              <FormHelperText className="text-danger">{validation.errorMessage}</FormHelperText>
            )}
          </>
        ) : (
          <Select
            label={label}
            options={options?.selectOptions}
            value={value?.value || value?.valueNumber || ''}
            onChange={(newValue) => {
              let valueObject: any = {};
              if (fieldType === 'number') {
                valueObject = { valueNumber: newValue };
              } else {
                valueObject = { value: newValue };
              }
              onChange(valueObject);
            }}
            selectAllowCreate={options?.selectAllowCreate}
            error={validation.error}
            helperText={validation.errorMessage}
          />
        )}
      </>
    );
  }

  switch (fieldType) {
    case 'label': {
      return <DisplayRichText value={options?.staticText} />;
    }
    case 'date': {
      return (
        <LocalizationProvider
          dateAdapter={AdapterMoment}
          //  libInstance={moment} utils={MomentUtils}
        >
          <DatePicker
            disabled={disabled}
            // fullWidth
            // size="small"
            // inputVariant="outlined"
            // placeholder={moment().format('L')}
            inputFormat="MM/DD/YYYY"
            value={value && value?.valueDate ? moment(value.valueDate) : null}
            onChange={(newValue) => onChange({ field: _id, valueDate: moment(newValue) })}
            // animateYearScrolling
            renderInput={(props) => (
              <TextField
                {...props}
                fullWidth
                size="small"
                variant="outlined"
                placeholder={moment().format('L')}
                error={validation.error}
                helperText={validation.errorMessage}
              />
            )}
          />
        </LocalizationProvider>
      );
    }
    case 'dateTime': {
      return (
        <LocalizationProvider
          dateAdapter={AdapterMoment}
          //  libInstance={moment} utils={MomentUtils}
        >
          <DateTimePicker
            disabled={disabled}
            // fullWidth
            // size="small"
            // inputVariant="outlined"
            // placeholder={moment().format('L')}
            inputFormat="lll"
            value={value && value?.valueDate ? moment(value.valueDate) : null}
            onChange={(newValue) => onChange({ field: _id, valueDate: moment(newValue) })}
            // animateYearScrolling
            renderInput={(props) => (
              <TextField
                {...props}
                fullWidth
                size="small"
                variant="outlined"
                placeholder={moment().format('L')}
                error={validation.error}
                helperText={validation.errorMessage}
              />
            )}
          />
        </LocalizationProvider>
      );
    }
    case 'richTextarea': {
      return (
        <>
          <RichTextarea
            value={value?.value || ''}
            onChange={(newValue) => onChange({ value: newValue })}
          />
          {validation.error && (
            <FormHelperText className="text-danger">{validation.errorMessage}</FormHelperText>
          )}
        </>
      );
    }
    case 'boolean': {
      return (
        <>
          <FormControlLabel
            disabled={disabled}
            control={
              <Checkbox
                checked={value ? value.valueBoolean : false}
                onChange={({ target }) => onChange({ field: _id, valueBoolean: target.checked })}
                name="valueBoolean"
                color="primary"
              />
            }
            label={label}
          />
          {validation.error && (
            <FormHelperText className="text-danger">{validation.errorMessage}</FormHelperText>
          )}
        </>
      );
    }
    case 'image': {
      return (
        <>
          <ImagePicker2
            label="Select Image"
            fileType="image/*"
            // mutiple={options?.multipleValues}
            state={value}
            setState={(newValue) => onChange({ field: _id, ...newValue })}
            formId={formId}
          />
          {validation.error && (
            <FormHelperText className="text-danger">{validation.errorMessage}</FormHelperText>
          )}
        </>
      );
    }
    case 'file': {
      return (
        <div>
          {value?.value ? (
            <DisplayFiles
              urls={[value?.value]}
              onDelete={(url) => onChange({ field: _id, value: '' })}
            />
          ) : (
            <FileUpload onUpload={(fileUrls) => onChange({ field: _id, value: fileUrls[0] })} />
          )}
          {validation.error && (
            <FormHelperText className="text-danger">{validation.errorMessage}</FormHelperText>
          )}
        </div>
      );
    }
    case 'phoneNumber': {
      return (
        <>
          <PhoneInput
            countryCodeEditable={false}
            country="us"
            preferredCountries={['us']}
            enableSearch
            value={value?.valueNumber?.toString() || ''}
            onChange={(phone) => onChange({ field: _id, valueNumber: phone })}
            inputStyle={validation.error ? { borderColor: 'red' } : {}}
          />
          {validation.error && (
            <FormHelperText className="text-danger">{validation.errorMessage}</FormHelperText>
          )}
        </>
      );
    }
    case 'number': {
      if (options?.physicalQuantity) {
        return (
          <UnitQuantityInput
            value={value}
            label={label}
            options={options}
            onChange={(newValue) => onChange({ ...newValue })}
            disabled={disabled}
            error={validation.error}
            helperText={validation.errorMessage}
          />
        );
      }
      return (
        <TextField
          fullWidth
          placeholder={label}
          variant="outlined"
          name="valueNumber"
          size="small"
          type="number"
          disabled={disabled}
          value={value ? value.valueNumber : ''}
          onChange={({ target }) => onChange({ field: _id, valueNumber: target.value })}
          error={validation.error}
          helperText={validation.errorMessage}
        />
      );
    }
    case 'colorPicker': {
      return (
        <ColorInput
          label=""
          color={value ? value.value : ''}
          onColorChange={(e: any) => onChange({ field: _id, value: e })}
        />
      );
    }
    case 'barcodeScanner': {
      return (
        <BarcodeInput
          label=""
          barcode={value ? value.value : ''}
          onBarcodeChange={(e: any) => onChange({ field: _id, value: e })}
        />
      );
    }
    case 'address': {
      return <AddressSearch _id={_id} onChange={onChange} values={value} />;
    }
    case 'lighthouseReport': {
      return (
        <TextField
          multiline
          rows={6}
          fullWidth
          placeholder={label}
          variant="outlined"
          name="value"
          size="small"
          type={['email', 'password'].includes(fieldType) ? fieldType : 'text'}
          disabled
          value={value ? value.value : ''}
          onChange={({ target }) => onChange({ field: _id, value: target.value })}
        />
      );
    }
    case 'link': {
      const textValidation = validateValue(validate, value, {
        options,
        fieldType: ['link'].includes(fieldType) ? 'url' : 'text',
      });
      return (
        <TextField
          fullWidth
          placeholder={label}
          variant="outlined"
          name="value"
          size="small"
          type="url"
          disabled={disabled}
          value={value ? value.value : ''}
          onChange={({ target }) => onChange({ field: _id, value: target.value })}
          error={textValidation.error}
          helperText={textValidation.errorMessage}
        />
      );
    }
    case 'response': {
      return (
        <>
          {value?.response?._id ? (
            <Response
              responseId={value?.response?._id}
              hideBreadcrumbs
              deleteCallBack={() => onChange({ field: _id, response: null })}
            />
          ) : (
            <>
              {form?._id && addOption?.showDrawer && (
                <CreateResponseDrawer
                  open={addOption?.showDrawer}
                  onClose={() => setAddOption({ ...addOption, showDrawer: false })}
                  title={label}
                  formId={form?._id}
                  createCallback={(newResponse) => {
                    onChange({ field: _id, response: newResponse });
                    setAddOption({ ...addOption, showDrawer: false });
                  }}
                />
              )}
              <Button
                variant="contained"
                size="small"
                className="mt-2"
                onClick={() => setAddOption({ ...addOption, showDrawer: true })}
              >
                Add
              </Button>
            </>
          )}
          {validation.error && (
            <FormHelperText className="text-danger">{validation.errorMessage}</FormHelperText>
          )}
        </>
      );
    }
    case 'form': {
      return (
        <>
          <SelectForm
            placeholder={`${label} form`}
            label={null}
            value={value?.form}
            onChange={(newValue) => onChange({ field: _id, form: newValue })}
            error={validation.error}
            helperText={validation.errorMessage}
          />
        </>
      );
    }
    case 'board': {
      return (
        <>
          <Board
            editMode
            board={value?.options?.board || defaultBoard}
            onBoardChange={(board) => onChange({ options: { board } })}
          />
          {validation.error && (
            <FormHelperText className="text-danger">{validation.errorMessage}</FormHelperText>
          )}
        </>
      );
    }
    case 'diagram': {
      return (
        <>
          <Diagram
            value={value?.options?.diagram || defaultDiagram}
            onChange={(diagram) => onChange({ options: { diagram } })}
          />
          {validation.error && (
            <FormHelperText className="text-danger">{validation.errorMessage}</FormHelperText>
          )}
        </>
      );
    }
    case 'flowDiagram': {
      return (
        <>
          <ReactFlow
            editMode
            flow={value?.options?.flowDiagram}
            onFlowChange={(flowDiagram) => onChange({ options: { flowDiagram } })}
          />
          {validation.error && (
            <FormHelperText className="text-danger">{validation.errorMessage}</FormHelperText>
          )}
        </>
      );
    }
    default: {
      const textValidation = validateValue(validate, value, {
        options,
        fieldType: ['email'].includes(fieldType) ? fieldType : 'text',
      });
      return (
        <TextField
          multiline={fieldType === 'textarea'}
          rows={fieldType === 'textarea' && 6}
          fullWidth
          placeholder={label}
          variant="outlined"
          name="value"
          size="small"
          type={['email', 'password'].includes(fieldType) ? fieldType : 'text'}
          disabled={disabled}
          value={value ? value.value : ''}
          onChange={({ target }) => onChange({ field: _id, value: target.value })}
          error={textValidation.error}
          helperText={textValidation.errorMessage}
        />
      );
    }
  }
}
