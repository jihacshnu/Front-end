/* eslint-disable react/jsx-wrap-multilines */
import { useEffect } from 'react';

// MUI IMPORTS
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
import InfoOutlined from '@mui/icons-material/InfoOutlined';

// SHARED IMPORTS
import { useAddFields } from '@frontend/shared/hooks/form';
import { quantities } from '@frontend/shared/utils/quantities';
import { IField } from '@frontend/shared/types/form';

// OTHERS
import InputGroup from '../../common/InputGroup';
import LoadingButton from '../../common/LoadingButton';
import { onAlert } from '../../../utils/alert';
import { getFormFieldTypes } from '../fieldTypes';
import RichTextarea from '../../common/RichTextarea2';
import SelectForm from '../SelectForm';
import SelectFormFields from '../SelectFormFields';
import SelectTemplate from '../../template/SelectTemplate';
import Formula from './formula/Formula';
import FieldCondition from './field-condition/FieldCondition';
import DefaultValue from './DefaultValue';
// import HiddenCondition from './HiddenCondition';
import FieldConditionForm from './field-condition/FieldConditionForm';

interface IProps {
  onCancel?: () => void;
  onSave: (field: any, action: string) => void;
  field: IField | null;
  isWidget?: boolean;
  isDefault?: boolean;
  parentFields?: any[];
  isTab?: boolean;
}

export default function AddField({
  onCancel,
  onSave,
  field = null,
  isWidget = false,
  isDefault,
  parentFields = [],
  isTab,
}: IProps) {
  const { formik, formLoading, setFormValues, onOptionChange } = useAddFields({
    onAlert,
    onSave,
  });

  useEffect(() => {
    if (field) {
      setFormValues(field);
      window.scrollTo(0, 0);
    }
  }, [field]);

  useEffect(() => {
    if (isWidget) {
      formik.setFieldValue('isWidget', true);
    }
  }, [isWidget]);

  const isWidgetForm = formik.values.fieldType === 'form' && isWidget;

  return (
    <form className="px-2" onSubmit={formik.handleSubmit}>
      <InputGroup data-testid="field-label-input-grp">
        <TextField
          data-testid="field-label"
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
          <InputLabel data-testid="field-type-label" id="fieldType-simple-select-outlined-label">
            Field Type*
          </InputLabel>
          <Select
            data-testid="field-type-select"
            labelId="fieldType-simple-select-outlined-label"
            id="fieldType-simple-select-outlined"
            name="fieldType"
            value={formik.values.fieldType}
            onChange={formik.handleChange}
            label="Field Type*"
            inputProps={{ 'aria-describedby': 'fieldType-helperText' }}
            MenuProps={{ id: 'fieldType-menu' }}
          >
            {getFormFieldTypes(isWidget)?.map((option, index) => (
              <MenuItem value={option.value} key={index}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.fieldType && formik.errors.fieldType && (
            <FormHelperText id="fieldType-helperText" className="text-danger">
              {formik.errors.fieldType}
            </FormHelperText>
          )}
        </FormControl>
      </InputGroup>
      {(['response'].includes(formik.values.fieldType) || isWidgetForm) && (
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

          {formik.values.form && formik.values.fieldType === 'response' && (
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
      {isTab && formik.values.fieldType === 'form' && (
        <>
          <InputGroup>
            <FormControlLabel
              className="mt-n2 ml-2"
              disabled={formik.isSubmitting}
              control={
                <Checkbox
                  checked={formik.values.options?.addToAllForms}
                  onChange={({ target }) => onOptionChange({ addToAllForms: target.checked })}
                  name="addToAllForms"
                  color="primary"
                />
              }
              label="Add tab to all forms"
            />
          </InputGroup>
        </>
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
      {formik?.values?.fieldType === 'number' && (
        <>
          <InputGroup>
            <FormControl variant="outlined" fullWidth size="small">
              <InputLabel id="physical-quantity-select-outlined-label">
                Physical Quantity
              </InputLabel>
              <Select
                labelId="physical-quantity-select-outlined-label"
                id="physical-quantity-select-outlined"
                name="physicalQuantity"
                value={formik.values.options?.physicalQuantity}
                onChange={({ target }) =>
                  onOptionChange({ physicalQuantity: target.value, unit: '' })
                }
                label="Physical Quantity*"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {Object.keys(quantities)?.map((physicalQuantity, i) => (
                  <MenuItem value={physicalQuantity} key={i}>
                    {physicalQuantity}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </InputGroup>
          {formik.values.options?.physicalQuantity && (
            <InputGroup>
              <FormControl variant="outlined" fullWidth size="small">
                <InputLabel id="unit-select-outlined-label">Unit</InputLabel>
                <Select
                  labelId="unit-select-outlined-label"
                  id="unit-select-outlined"
                  name="unit"
                  value={formik.values.options?.unit}
                  onChange={({ target }) => onOptionChange({ unit: target.value })}
                  label="Unit"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {quantities?.[formik.values.options?.physicalQuantity]?.map((unit, i) => (
                    <MenuItem value={unit} key={i}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </InputGroup>
          )}
        </>
      )}

      {['response'].includes(formik.values.fieldType) && (
        <FieldCondition
          formFields={parentFields}
          field={formik.values}
          onConditionsChange={(newConditions) => onOptionChange({ conditions: newConditions })}
        />
      )}
      {['response'].includes(formik.values.fieldType) && (
        <div>
          <div className="mt-n2">
            <FormControlLabel
              disabled={formik.isSubmitting}
              control={
                <Checkbox
                  checked={formik.values.options?.twoWayRelationship}
                  onChange={({ target }) => onOptionChange({ twoWayRelationship: target.checked })}
                  name="twoWayRelationship"
                  color="primary"
                />
              }
              label="Two way relationship"
              data-testid="two-way-relationship-field-option"
            />
            <Tooltip title="Parent will have child Id & child will have parent Id">
              <InfoOutlined className="mt-n2 ml-n2" fontSize="small" />
            </Tooltip>
          </div>
          {formik.values.options?.twoWayRelationship && (
            <div>
              <InputGroup>
                <TextField
                  fullWidth
                  size="small"
                  label="Relation label"
                  name="relationLabel"
                  value={formik.values.options.relationLabel}
                  onChange={({ target }) => onOptionChange({ relationLabel: target.value })}
                  error={!formik.values.options.relationLabel}
                  helperText={!formik.values.options?.relationLabel && 'Required'}
                />
              </InputGroup>
              <InputGroup>
                <FormControl fullWidth size="small" error={!formik.values.options.relationFieldId}>
                  <InputLabel>Relation Field</InputLabel>
                  <Select
                    value={formik.values.options?.relationFieldId}
                    label="Relation Field"
                    name="relationFieldId"
                    onChange={({ target }) => onOptionChange({ relationFieldId: target.value })}
                  >
                    {parentFields
                      ?.filter((f) => f?._id !== field?._id)
                      ?.map((f) => (
                        <MenuItem key={f?._id} value={f?._id}>
                          {f?.label}
                        </MenuItem>
                      ))}
                  </Select>
                  {!formik.values.options.relationFieldId && (
                    <FormHelperText>Required</FormHelperText>
                  )}
                </FormControl>
              </InputGroup>
            </div>
          )}
          <div>
            <FormControlLabel
              disabled={formik.isSubmitting}
              control={
                <Checkbox
                  checked={formik.values.options?.dependentRelationship}
                  onChange={({ target }) =>
                    onOptionChange({ dependentRelationship: target.checked })
                  }
                  name="dependentRelationship"
                  color="primary"
                />
              }
              label="Dependent relationship"
              data-testid="dependent-relationship-field-option"
            />
            <Tooltip title="If parent is deleted child is also deleted">
              <InfoOutlined className="mt-n2 ml-n2" fontSize="small" />
            </Tooltip>
          </div>
        </div>
      )}
      {!isWidget && !isWidgetForm && !['label', 'template'].includes(formik.values.fieldType) && (
        <>
          <DefaultValue
            field={formik.values}
            onDefaultValueChange={(defaultValue) => {
              onOptionChange({ defaultValue });
            }}
          />
          {['response', 'text', 'number'].includes(formik.values.fieldType) && (
            <>
              <FormControlLabel
                disabled={formik.values.fieldType === 'form' || formik.isSubmitting}
                control={
                  <Checkbox
                    checked={
                      formik.values.fieldType === 'form' || formik.values.options?.selectItem
                    }
                    onChange={({ target }) => onOptionChange({ selectItem: target.checked })}
                    name="selectItem"
                    color="primary"
                  />
                }
                label={`Select Item ${
                  formik.values.fieldType === 'response' ? '(Independent relation)' : ''
                }`}
                data-testid="select-item-field-option"
              />
              {formik.values.fieldType !== 'form' && formik.values.options?.selectItem && (
                <>
                  <FormControlLabel
                    className="mt-n2 ml-2"
                    disabled={formik.isSubmitting}
                    control={
                      <Checkbox
                        checked={formik.values.options?.selectAllowCreate}
                        onChange={({ target }) =>
                          onOptionChange({ selectAllowCreate: target.checked })
                        }
                        name="selectAllowCreate"
                        color="primary"
                      />
                    }
                    label="Can create new option"
                    data-testid="select-allow-create-field-option"
                  />
                  {formik.values.fieldType === 'response' ? (
                    <div className="ml-3">
                      <FormLabel>Show Options</FormLabel>
                      <br />
                      <FormControlLabel
                        className="mt-n2"
                        disabled={formik.isSubmitting}
                        control={
                          <Checkbox
                            checked={formik.values.options?.showOptionCreatedByUser}
                            onChange={({ target }) =>
                              onOptionChange({ showOptionCreatedByUser: target.checked })
                            }
                            name="showOptionCreatedByUser"
                            color="primary"
                          />
                        }
                        label="Created by user"
                        data-testid="show-option-created-by-user-field-option"
                      />
                      <FormControlLabel
                        className="mt-n2"
                        disabled={formik.isSubmitting}
                        control={
                          <Checkbox
                            checked={formik.values.options?.showOptionCreatedOnTemplate}
                            onChange={({ target }) =>
                              onOptionChange({ showOptionCreatedOnTemplate: target.checked })
                            }
                            name="showOptionCreatedOnTemplate"
                            color="primary"
                          />
                        }
                        label="Created on template"
                        data-testid="show-option-created-on-template-field-option"
                      />
                    </div>
                  ) : (
                    <>
                      <FormControlLabel
                        className="mt-n2 ml-2"
                        disabled={formik.isSubmitting}
                        control={
                          <Checkbox
                            checked={formik.values.options?.showAsCheckbox}
                            onChange={({ target }) =>
                              onOptionChange({ showAsCheckbox: target.checked })
                            }
                            name="showAsCheckbox"
                            color="primary"
                          />
                        }
                        label="Show as checkbox"
                        data-testid="show-as-checkbox-field-option"
                      />
                      <div className="mb-3">
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
                          <FormControl
                            variant="outlined"
                            fullWidth
                            size="small"
                            key={index}
                            className="mt-2"
                          >
                            <InputLabel htmlFor={`outlined-adornment-${index + 1}`}>
                              Option {index + 1}*
                            </InputLabel>
                            <OutlinedInput
                              id={`outlined-adornment-${index + 1}`}
                              type={formik.values?.fieldType === 'number' ? 'number' : 'text'}
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
                    </>
                  )}
                </>
              )}
            </>
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
              data-testid="required-field-field-option"
            />
          </div>
          <div>
            <FormControlLabel
              className="mt-n2"
              disabled={formik.values.options?.default || formik.isSubmitting}
              control={
                <Checkbox
                  checked={formik.values.options?.hidden}
                  onChange={({ target }) => onOptionChange({ hidden: target.checked })}
                  name="hidden"
                  color="primary"
                />
              }
              label="Hidden"
            />
            {formik.values.options?.hidden && (
              <div className="pl-2">
                <FormControlLabel
                  className="mt-n2"
                  control={
                    <Checkbox
                      checked={formik.values.options?.hiddenConditions?.length > 0}
                      onChange={({ target }) =>
                        onOptionChange({
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          hiddenConditions: target.checked ? [{}] : null,
                        })
                      }
                      name="showIf"
                      color="primary"
                    />
                  }
                  label="Show If condition"
                />
                {formik.values.options?.hiddenConditions?.length > 0 && (
                  <FieldConditionForm
                    conditions={formik.values.options?.hiddenConditions}
                    onConditionsChange={(hiddenConditions) =>
                      onOptionChange({
                        hiddenConditions,
                      })
                    }
                  />
                )}
              </div>
            )}
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
            data-testid="multiple-value-field-option"
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
            data-testid="unique-field-option"
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
                data-testid="case-insensitive-unique-field-option"
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
              data-testid="show-comment-box-field-option"
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
            data-testid="show-star-rating-field-option"
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
            data-testid="response-not-editable-field-option"
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
            data-testid="sys-calcAndsaved-field-option"
          />
          {/* {formik.values.options?.systemCalculatedAndSaved && (
            <>
              <InputGroup>
                <FormControl fullWidth size="small">
                  <InputLabel id="system-value-select-label">System value</InputLabel>
                  <Select
                    labelId="system-value-select-label"
                    id="system-value-select"
                    value={field?.options?.systemValue?._id}
                    label="System value"
                    onChange={({ target }) => {
                      const selectedField = parentFields?.find((f) => f?._id === target?.value);
                      if (selectedField?._id) {
                        onOptionChange({ systemValue: selectedField });
                      }
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
            </>
          )} */}
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
              data-testid="sys-calAndview-field-option"
            />
          </div>
          {[
            formik.values.options?.systemCalculatedAndSaved,
            formik.values.options?.systemCalculatedAndView,
          ].includes(true) &&
            formik.values.fieldType === 'number' && (
              <Formula
                formula={formik.values.options?.formula}
                onFormulaChange={(newFormula) => {
                  const formula = formik.values.options?.formula || {};
                  onOptionChange({ formula: { ...formula, ...newFormula } });
                }}
                fields={parentFields?.filter(
                  (f) => f?.fieldType === 'number' && field?._id !== f?._id,
                )}
              />
            )}
        </>
      )}
      <div className="mb-2">
        <LoadingButton type="submit" loading={formLoading} size="small" data-testid="form-save-btn">
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
