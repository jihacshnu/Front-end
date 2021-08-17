import {
  useGetFieldValuesByItem,
  useGetFieldsByType,
  useDeleteFieldValue,
} from '@frontend/shared/hooks/field';
import FieldsSkeleton from './FieldsSkeleton';
import ErrorLoading from '../common/ErrorLoading';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import AddCircle from '@material-ui/icons/AddCircle';
import FieldValueForm from './FieldValueForm';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import { useState } from 'react';
import Link from 'next/link';
import CRUDMenu from '../common/CRUDMenu';
import Backdrop from '../common/Backdrop';
import { onAlert } from '../../utils/alert';
import { useSelector } from 'react-redux';

const initialState = {
  showForm: false,
  showMenu: null,
  selectedFieldValue: null,
  edit: false,
};

function ItemOneFields({ field, parentId }) {
  const [state, setState] = useState(initialState);
  const attributes = useSelector(({ auth }: any) => auth.attributes);
  const currentUserId = attributes['custom:_id'];

  const deleteCallback = () => {
    setState({ ...state, showMenu: null, selectedFieldValue: null, edit: false });
  };

  const { data, error, loading } = useGetFieldValuesByItem({ parentId, field: field._id });
  const { handleDelete, deleteLoading } = useDeleteFieldValue({
    onAlert,
    parentId,
    field: field._id,
  });

  const formProps = {
    field: field._id,
    parentId: parentId,
    typeId: field.typeId._id,
    fieldType: field.fieldType,
    label: `${field.label} Value`,
    onCancel: () => setState(initialState),
  };

  if (!error && (!data || !data.getFieldValuesByItem)) {
    return <FieldsSkeleton />;
  } else if (error) {
    return <ErrorLoading error={error} />;
  }

  return (
    <div key={field._id} className="mt-4">
      <Typography variant="h5">{field.label}</Typography>
      {state.showForm ? (
        <FieldValueForm {...formProps} />
      ) : (
        <Button
          className="mt-2"
          size="small"
          variant="outlined"
          component="span"
          color="primary"
          startIcon={<AddCircle />}
          onClick={() => setState({ ...initialState, showForm: true })}>
          Add Value
        </Button>
      )}
      <List component="div">
        {data.getFieldValuesByItem.data.map((fieldValue, index) =>
          state.selectedFieldValue &&
          state.selectedFieldValue._id === fieldValue._id &&
          state.edit ? (
            <FieldValueForm key={fieldValue._id} {...formProps} fieldValue={fieldValue} />
          ) : (
            <>
              <ListItem key={fieldValue._id}>
                <ListItemText
                  secondary={
                    <span style={{ paddingLeft: 10 }}>
                      {field.fieldType === 'string' ? (
                        fieldValue.value
                      ) : (
                        <Link href={`/types/${field.typeId.slug}/${fieldValue.itemId.slug}`}>
                          {fieldValue.itemId.title}
                        </Link>
                      )}
                    </span>
                  }
                  primary={
                    <Link href={`/user/${fieldValue.createdBy._id}`}>
                      <Chip
                        avatar={
                          <Avatar
                            alt={fieldValue.createdBy.name}
                            src={fieldValue.createdBy.picture}
                          />
                        }
                        label={<span>{fieldValue.createdBy.name}</span>}
                        style={{ border: 'none', marginBottom: 10 }}
                        variant="outlined"
                      />
                    </Link>
                  }
                />
                {currentUserId === fieldValue.createdBy._id && (
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={(event) =>
                        setState({
                          ...state,
                          showMenu: event.currentTarget,
                          selectedFieldValue: fieldValue,
                        })
                      }>
                      <MoreHoriz />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
              {data.getFieldValuesByItem.data.length - 1 !== index && (
                <Divider key={fieldValue._id} />
              )}
            </>
          ),
        )}
      </List>
      <Divider />
      <CRUDMenu
        show={state.showMenu}
        onClose={() => setState(initialState)}
        onDelete={() => handleDelete(state.selectedFieldValue._id, deleteCallback)}
        onEdit={() => setState({ ...state, edit: true, showMenu: null })}
      />
      <Backdrop open={deleteLoading} />
    </div>
  );
}

export default function ItemsFieldsMap({ parentId }) {
  const { data, loading, error } = useGetFieldsByType({ parentId });
  if (loading || (!error && (!data || !data.getFieldsByType))) {
    return <FieldsSkeleton />;
  } else if (error) {
    return <ErrorLoading error={error} />;
  }
  return (
    <>
      {data.getFieldsByType.data.map((field) => (
        <ItemOneFields parentId={parentId} field={field} key={field._id} />
      ))}
    </>
  );
}
