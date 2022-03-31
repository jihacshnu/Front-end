import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { generateObjectId } from '@frontend/shared/utils/objectId';
import FormControlLabel from '@mui/material/FormControlLabel';
import { getForm } from '@frontend/shared/hooks/form/getForm';
import Switch from '@mui/material/Switch';
import { useEffect, useState } from 'react';
import FormSetting from './FormSetting';
import InputGroup from '../common/InputGroup';
import Overlay from '../common/Overlay';
import ResponseLayout from '../response/ResponseLayout';
import { ActionsWrapper } from './Actions';
import { Grid } from '@mui/material';
import FormFields from './FormFields';

interface IProps {
  isSection?: boolean;
  fields: any;
  formId: string;
  open: boolean;
  onClose: () => void;
  settings: any;
  onSettingsChange: (settings: any) => void;
  parentPageFields: any;
}

export default function CustomFormSettings({
  isSection = false,
  fields,
  formId,
  open,
  onClose,
  settings,
  onSettingsChange,
  parentPageFields = [],
}: IProps): any {
  const [tab, setTab] = useState('settings');
  const [pageFields, setPageFields] = useState([]);
  const [state, setState] = useState({});

  useEffect(() => {
    if (!(pageFields?.length > 0)) {
      getFormFields();
    }
  }, [fields]);

  useEffect(() => {
    setState({ ['fields']: pageFields });
  }, [pageFields]);

  const getFormFields = async () => {
    const formFields = fields?.filter((f) => f?.fieldType === 'form');
    let newPageFields = [];
    for (const field of formFields) {
      const form = await getForm(field?.form?._id);
      if (form) {
        const pageField = form?.fields?.map((f) => ({
          ...f,
          label: `${field?.label} - ${f?.label}`,
          formId: form?._id,
          _id: f?._id,
        }));
        newPageFields = [...newPageFields, ...pageField];
      }
    }
    setPageFields(newPageFields);
  };

  return (
    <Overlay title="Form Settings" open={open} onClose={onClose}>
      <InputGroup className="pl-2">
        <FormControlLabel
          label="Use custom form settings"
          control={
            <Switch
              color="primary"
              checked={settings?.active}
              onChange={(e) => onSettingsChange({ ...settings, active: e.target.checked })}
            />
          }
        />
      </InputGroup>
      {settings?.active && (
        <>
          <Tabs
            variant="fullWidth"
            value={tab}
            indicatorColor="primary"
            textColor="primary"
            onChange={(event, newValue) => setTab(newValue)}
          >
            <Tab label="Settings" value="settings" />
            <Tab label="Actions" value="actions" />
            <Tab label="Workflows" value="workflows" />
          </Tabs>
          {tab === 'settings' && (
            <FormSetting
              formId={formId}
              settings={settings}
              onChange={(val) => onSettingsChange({ ...settings, ...val })}
              isSection={isSection}
              state={state}
            />
          )}
          {tab === 'workflows' && (
            <>
              <InputGroup className="pl-2">
                <FormControlLabel
                  label="Use custom response layout"
                  control={
                    <Switch
                      color="primary"
                      checked={settings?.customResponseLayout}
                      onChange={(e) => {
                        let newSetting = { ...settings, customResponseLayout: e.target.checked };
                        if (!settings?.customSectionId && e.target.checked) {
                          newSetting = { ...newSetting, customSectionId: generateObjectId() };
                        }
                        onSettingsChange(newSetting);
                      }}
                    />
                  }
                />
              </InputGroup>
              {settings?.customSectionId && (
                <ResponseLayout
                  _id={settings?.customSectionId}
                  parentPageFields={[...pageFields, ...parentPageFields]}
                />
              )}
            </>
          )}
          {tab === 'actions' && (
            <ActionsWrapper
              pageFields={[...pageFields, ...parentPageFields]}
              settings={settings}
              onChange={(actions) => onSettingsChange({ ...settings, actions })}
            />
          )}
        </>
      )}
    </Overlay>
  );
}
