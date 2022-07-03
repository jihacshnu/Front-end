import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useState } from 'react';
import InputGroup from '../common/InputGroup';
import RichTextarea2 from '../common/RichTextarea2';

interface IProps {
  open: boolean;
  data: any;
  onChange: (newDate: any) => void;
  onClose: () => void;
}

export default function EditNode({ open, data, onChange, onClose }: IProps) {
  const [state, setState] = useState(data);
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Node</DialogTitle>
      <DialogContent dividers>
        <div style={{ minWidth: 200 }}>
          <InputGroup>
            {state?.formId ? (
              <FormControl size="small" fullWidth variant="outlined">
                <InputLabel id="demo-simple-select-standard-label">Form view</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={state.formView || 'formName'}
                  onChange={({ target }) => setState({ ...state, formView: target.value })}
                  label="Form view"
                >
                  <MenuItem value="formName">Display form name</MenuItem>
                  <MenuItem value="fullForm">Display full form</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <>
                <RichTextarea2
                  value={state?.label || ''}
                  onChange={(newValue) => setState({ ...state, label: newValue })}
                />
              </>
            )}
          </InputGroup>
          <InputGroup>
            <InputLabel>Background color</InputLabel>
            <input
              type="color"
              value={state?.backgroundColor || '#ffffff'}
              onChange={({ target }) => setState({ ...state, backgroundColor: target.value })}
            />
          </InputGroup>
          <InputGroup>
            <InputLabel>Text color</InputLabel>
            <input
              type="color"
              value={state?.color || '#000000'}
              onChange={({ target }) => setState({ ...state, color: target.value })}
            />
          </InputGroup>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onChange(state)} variant="contained" size="small">
          Save
        </Button>
        <Button onClick={onClose} variant="outlined" size="small">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
