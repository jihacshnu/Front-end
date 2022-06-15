/* eslint-disable react/jsx-wrap-multilines */
import { useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import FormLabel from '@mui/material/FormLabel';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { useAddFields } from '@frontend/shared/hooks/form';
import InputGroup from '../common/InputGroup';
import LoadingButton from '../common/LoadingButton';
import { onAlert } from '../../utils/alert';
import { getFormFieldTypes } from './fieldTypes';
import RichTextarea from '../common/RichTextarea2';
import SelectForm from './SelectForm';
import SelectTemplate from '../template/SelectTemplate';
import SelectFormFields from './SelectFormFields';

interface IProps {
  onCancel?: () => void;
  onSave: (field: any, action: string) => void;
  field: any;
  isSection?: boolean;
  isDefault?: boolean;
  parentFields?: any[];
}

const globalFields = [
  { label: 'User name', globalState: true, _id: 'userName' },
  { label: 'User email', globalState: true, _id: 'userEmail' },
];

export default function FieldForm({
  onCancel,
  onSave,
  field = null,
  isSection = false,
  isDefault,
  parentFields: tParentFields = [],
}: IProps): any {
  const { formik, formLoading, setFormValues, onOptionChange } = useAddFields({
    onAlert,
    onSave,
  });

  const parentFields = [...tParentFields, ...globalFields];

  useEffect(() => {
    if (field) {
      setFormValues(field);
      window.scrollTo(0, 0);
    }
  }, [field]);

  return (
    <form className="px-2" onSubmit={formik.handleSubmit}>
      <InputGroup>
        <TextField
          autoFocus
          fullWidth
          label="Label*"
          variant="outlined"
          name="label"
          size="small"
          disabled={formik.isSubmitting}
          value={formik.values.label}
          onChange={formik.handleChange}
          error={formik.touched.label && Boolean(formik.errors.label)}
          helperText={formik.touched.label && formik.errors.label}
        />
      </InputGroup>
      <InputGroup>
        <FormControl
          variant="outlined"
          fullWidth
          size="small"
          error={Boolean(formik.touched.fieldType && formik.errors.fieldType)}
        >
          <InputLabel id="fieldType-simple-select-outlined-label">Field Type*</InputLabel>
          <Select
            labelId="fieldType-simple-select-outlined-label"
            id="fieldType-simple-select-outlined"
            name="fieldType"
            value={formik.values.fieldType}
            onChange={formik.handleChange}
            label="Field Type*"
          >
            {getFormFieldTypes(isSection)?.map((option, index) => (
              <MenuItem value={option.value} key={index}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.fieldType && formik.errors.fieldType && (
            <FormHelperText className="text-danger">{formik.errors.fieldType}</FormHelperText>
          )}
        </FormControl>
      </InputGroup>
      {['form', 'existingForm'].includes(formik.values.fieldType) && (
        <InputGroup>
          <SelectForm
            value={formik.values.form}
            onChange={(newValue) =>
              formik.setValues({
                ...formik.values,
                form: newValue,
                options: { ...formik.values.options, formField: '' },
              })
            }
            error={formik.touched.form && Boolean(formik.errors.form)}
            helperText={formik.touched.form && formik.errors.form}
          />
          {formik.values.form && formik.values.fieldType === 'existingForm' && (
            <div className="mt-3">
              <SelectFormFields
                formId={formik.values.form?._id}
                value={formik.values.options?.formField}
                onChange={(newValue) => onOptionChange({ formField: newValue })}
                error={!formik.values.options?.formField}
                helperText={!formik.values.options?.formField && 'required'}
              />
            </div>
          )}
        </InputGroup>
      )}
      {formik.values.fieldType === 'template' && (
        <InputGroup>
          <SelectTemplate
            value={formik.values.template}
            onChange={(newValue) => formik.setFieldValue('template', newValue, false)}
            error={formik.touched.template && Boolean(formik.errors.template)}
            helperText={formik.touched.template && formik.errors.template}
          />
        </InputGroup>
      )}
      {formik?.values?.fieldType === 'label' && (
        <RichTextarea
          value={formik.values.options?.staticText}
          onChange={(newValue) => onOptionChange({ staticText: newValue })}
        />
      )}
      {!isSection && !['label', 'form', 'template'].includes(formik.values.fieldType) && (
        <>
          {formik.values.fieldType === 'existingForm' && (
            <FormControlLabel
              disabled={formik.isSubmitting}
              control={
                <Checkbox
                  checked={formik.values.options?.dependentRelation}
                  onChange={({ target }) => onOptionChange({ dependentRelation: target.checked })}
                  name="dependentRelation"
                  color="primary"
                />
              }
              label="Dependent relation"
            />
          )}
          <FormControlLabel
            disabled={formik.isSubmitting}
            control={
              <Checkbox
                checked={formik.values.options?.selectItem}
                onChange={({ target }) => onOptionChange({ selectItem: target.checked })}
                name="selectItem"
                color="primary"
              />
            }
            label="Select Item"
          />
          {formik.values.options?.selectItem && (
            <FormControlLabel
              disabled={formik.isSubmitting}
              control={
                <Checkbox
                  checked={formik.values.options?.selectAllowCreate}
                  onChange={({ target }) => onOptionChange({ selectAllowCreate: target.checked })}
                  name="selectAllowCreate"
                  color="primary"
                />
              }
              label="Can create new option"
            />
          )}
          {formik.values.options?.selectItem && formik.values.fieldType !== 'existingForm' && (
            <div className="mb-3">
              <InputGroup>
                <FormControl
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!formik.values.options?.dataSource}
                >
                  <InputLabel id="dataSource-select-outlined-label">Data source*</InputLabel>
                  <Select
                    labelId="dataSource-select-outlined-label"
                    id="dataSource-select-outlined"
                    name="dataSource"
                    value={formik.values.options?.dataSource}
                    onChange={({ target }) => onOptionChange({ dataSource: target.value })}
                    label="Data source*"
                  >
                    <MenuItem value="options">Options</MenuItem>
                    <MenuItem value="response">Form response</MenuItem>
                  </Select>
                  {!formik.values.options?.dataSource && (
                    <FormHelperText className="text-danger">Required</FormHelperText>
                  )}
                </FormControl>
              </InputGroup>
              <FormLabel>
                Select Options
                <Tooltip title="Add New Option">
                  <IconButton
                    color="primary"
                    onClick={() =>
                      onOptionChange({
                        selectOptions:
                          formik.values.options?.selectOptions?.length > 0
                            ? [...formik.values?.options?.selectOptions, '']
                            : [''],
                      })
                    }
                  >
                    <AddCircleIcon />
                  </IconButton>
                </Tooltip>
              </FormLabel>
              {formik.values.options?.selectOptions?.map((option, index) => (
                <FormControl variant="outlined" fullWidth size="small" key={index} className="mt-2">
                  <InputLabel htmlFor={`outlined-adornment-${index + 1}`}>
                    Option {index + 1}*
                  </InputLabel>
                  <OutlinedInput
                    id={`outlined-adornment-${index + 1}`}
                    type="text"
                    error={!option}
                    value={option}
                    onChange={({ target }) =>
                      onOptionChange({
                        selectOptions: formik.values.options?.selectOptions?.map((m, i) =>
                          i === index ? target.value : m,
                        ),
                      })
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="delete"
                          onClick={() =>
                            onOptionChange({
                              selectOptions: formik.values.options?.selectOptions?.filter(
                                (m, i) => i !== index,
                              ),
                            })
                          }
                          edge="end"
                          size="large"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                    // labelWidth={65}
                  />
                </FormControl>
              ))}
            </div>
          )}
          <div>
            <FormControlLabel
              className="mt-n2"
              disabled={formik.values.options?.default || formik.isSubmitting}
              control={
                <Checkbox
                  checked={isDefault || formik.values.options?.required}
                  onChange={({ target }) => onOptionChange({ required: target.checked })}
                  name="required"
                  color="primary"
                />
              }
              label="Required"
            />
          </div>
          <FormControlLabel
            className="mt-n2"
            disabled={formik.isSubmitting}
            control={
              <Checkbox
                checked={formik.values.options?.multipleValues}
                onChange={({ target }) => onOptionChange({ multipleValues: target.checked })}
                name="multipleValues"
                color="primary"
              />
            }
            label="Multiple values"
          />
          <br />
          <FormControlLabel
            className="mt-n2"
            disabled={formik.isSubmitting}
            control={
              <Checkbox
                checked={formik.values.options?.unique}
                onChange={({ target }) => onOptionChange({ unique: target.checked })}
                name="unique"
                color="primary"
              />
            }
            label="Unique"
          />
          {formik.values?.options?.unique && (
            <div className="pl-3 mt-n3">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values?.options?.caseInsensitiveUnique}
                    onChange={({ target }) =>
                      onOptionChange({
                        caseInsensitiveUnique: target.checked,
                      })
                    }
                    name="caseInsensitiveUnique"
                    color="primary"
                  />
                }
                label="Case insensitive unique"
              />
            </div>
          )}
          <div>
            <FormControlLabel
              className="mt-n2"
              disabled={formik.isSubmitting}
              control={
                <Checkbox
                  checked={formik.values.options?.showCommentBox}
                  onChange={({ target }) => onOptionChange({ showCommentBox: target.checked })}
                  name="showCommentBox"
                  color="primary"
                />
              }
              label="Show comment box"
            />
          </div>
          <FormControlLabel
            className="mt-n2"
            disabled={formik.isSubmitting}
            control={
              <Checkbox
                checked={formik.values.options?.showStarRating}
                onChange={({ target }) => onOptionChange({ showStarRating: target.checked })}
                name="showStarRating"
                color="primary"
              />
            }
            label="Show star rating"
          />
          <br />
          <FormControlLabel
            className="mt-n2"
            disabled={formik.isSubmitting}
            control={
              <Checkbox
                checked={formik.values.options?.notEditable}
                onChange={({ target }) => onOptionChange({ notEditable: target.checked })}
                name="notEditable"
                color="primary"
              />
            }
            label="Response not editable"
          />
          <br />
          <FormControlLabel
            className="mt-n2"
            disabled={formik.isSubmitting}
            control={
              <Checkbox
                checked={formik.values.options?.systemCalculatedAndSaved}
                onChange={({ target }) =>
                  onOptionChange({ systemCalculatedAndSaved: target.checked })
                }
                name="systemCalculatedAndSaved"
                color="primary"
              />
            }
            label="System calculated & saved"
          />
          {formik.values.options?.systemCalculatedAndSaved && (
            <InputGroup>
              <FormControl fullWidth size="small">
                <InputLabel id="system-value-select-label">System value</InputLabel>
                <Select
                  labelId="system-value-select-label"
                  id="system-value-select"
                  value={field?.options?.systemValue?.fieldId}
                  label="System value"
                  onChange={({ target }) => {
                    let systemValue = {};
                    if (globalFields?.find((g) => g._id === target.value)) {
                      systemValue = {
                        fieldId: target?.value,
                        globalState: true,
                      };
                    } else {
                      const selectedField = parentFields?.find((f) => f?._id === target?.value);
                      systemValue = {
                        fieldId: target?.value,
                        formId: selectedField?.formId,
                      };
                    }
                    onOptionChange({ systemValue });
                  }}
                >
                  {parentFields
                    ?.filter((f) => f?._id !== field?._id)
                    ?.map((formField) => (
                      <MenuItem key={formField?._id} value={formField?._id}>
                        {formField?.label}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </InputGroup>
          )}
          <div>
            <FormControlLabel
              className="mt-n2"
              disabled={formik.isSubmitting}
              control={
                <Checkbox
                  checked={formik.values.options?.systemCalculatedAndView}
                  onChange={({ target }) =>
                    onOptionChange({ systemCalculatedAndView: target.checked })
                  }
                  name="systemCalculatedAndView"
                  color="primary"
                />
              }
              label="System calculated & view"
            />
          </div>
        </>
      )}
      <div className="mb-2">
        <LoadingButton type="submit" loading={formLoading} size="small">
          Save
        </LoadingButton>
        {onCancel && (
          <Button
            className="ml-2"
            disabled={formLoading}
            variant="outlined"
            size="small"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
      <Divider />
    </form>
  );
}
