import {
  useGetFieldValuesByItem,
  useGetFieldsByType,
  useDeleteFieldValue,
} from '@frontend/shared/hooks/field';
import FieldsSkeleton from './FieldsSkeleton';
import ErrorLoading from '../common/ErrorLoading';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import AddCircle from '@material-ui/icons/AddCircle';
import FieldValueForm from './FieldValueForm';
import IconButton from '@material-ui/core/IconButton';
import { useEffect, useState } from 'react';
import CRUDMenu from '../common/CRUDMenu';
import Backdrop from '../common/Backdrop';
import { onAlert } from '../../utils/alert';
import { useSelector } from 'react-redux';
import { Fragment } from 'react';
import FieldValueCard from './FieldValueCard';
import { convertToSlug } from './LeftNavigation';
import Carousel from 'react-material-ui-carousel';

const initialState = {
  showForm: false,
  showMenu: null,
  selectedFieldValue: null,
  edit: false,
  expanded: false,
  expandId: '',
};

function ItemOneFields({ field, parentId, showAuthor = true, guest }) {
  const [state, setState] = useState(initialState);
  const { attributes, admin } = useSelector(({ auth }: any) => auth);
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
    typeId: field.typeId ? field.typeId._id : null,
    typeSlug: field.typeId ? field.typeId.slug : null,
    fieldType: field.fieldType,
    label: field.label,
    onCancel: () => setState(initialState),
  };

  if (!error && (!data || !data.getFieldValuesByItem)) {
    return <FieldsSkeleton />;
  } else if (error) {
    return <ErrorLoading error={error} />;
  }

  const hasAlreadyAdded =
    data.getFieldValuesByItem.data.filter((v) => v.createdBy._id === currentUserId).length > 0;

  const showAddButton =
    data.getFieldValuesByItem.data.length === 0 ||
    (field.multipleValues &&
      !guest &&
      !state.showForm &&
      (field.oneUserMultipleValues || !hasAlreadyAdded));

  return (
    <div key={field._id} className="mt-4">
      <Divider />
      <Typography
        variant="h5"
        className="d-flex align-items-center"
        id={convertToSlug(field.label)}>
        <Badge badgeContent={data.getFieldValuesByItem.data.length} color="primary">
          {field.label}
        </Badge>
        {showAddButton && (
          <Tooltip title="Add New Value">
            <IconButton
              color="primary"
              onClick={() => setState({ ...initialState, showForm: true })}>
              <AddCircle />
            </IconButton>
          </Tooltip>
        )}
      </Typography>
      {state.showForm && <FieldValueForm {...formProps} />}
      {data.getFieldValuesByItem.data.length > 1 ? (
        <Carousel autoPlay={false} animation="slide" navButtonsAlwaysVisible={true}>
          {data.getFieldValuesByItem.data.map((fieldValue, index) => (
            <div className="px-5" key={fieldValue._id}>
              {state.selectedFieldValue &&
              state.selectedFieldValue._id === fieldValue._id &&
              state.edit ? (
                <FieldValueForm edit {...formProps} fieldValue={fieldValue} />
              ) : (
                <FieldValueCard
                  fieldValue={fieldValue}
                  field={field}
                  showAction={currentUserId === fieldValue.createdBy._id || admin}
                  showAuthor={showAuthor || showAddButton}
                  onSelect={(target, fieldValue) =>
                    setState({
                      ...state,
                      showMenu: target,
                      selectedFieldValue: fieldValue,
                    })
                  }
                />
              )}
              <p className="text-center w-100">
                {index + 1}/{data.getFieldValuesByItem.data.length}
              </p>
            </div>
          ))}
        </Carousel>
      ) : (
        data.getFieldValuesByItem.data.map((fieldValue, index) => (
          <Fragment key={fieldValue._id}>
            {state.selectedFieldValue &&
            state.selectedFieldValue._id === fieldValue._id &&
            state.edit ? (
              <FieldValueForm edit {...formProps} fieldValue={fieldValue} />
            ) : (
              <FieldValueCard
                fieldValue={fieldValue}
                field={field}
                showAction={currentUserId === fieldValue.createdBy._id || admin}
                showAuthor={showAuthor || showAddButton}
                onSelect={(target, fieldValue) =>
                  setState({
                    ...state,
                    showMenu: target,
                    selectedFieldValue: fieldValue,
                  })
                }
              />
            )}
          </Fragment>
        ))
      )}
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

export default function ItemsFieldsMap({
  parentId,
  typeId,
  showAuthor = true,
  guest = false,
  setFields = (arg: any) => {},
  pushToAnchor = () => {},
}) {
  const { data, loading, error } = useGetFieldsByType({ parentId: typeId });

  useEffect(() => {
    if (data && data.getFieldsByType) {
      setFields(data.getFieldsByType.data);
      pushToAnchor();
    }
  }, [data]);

  if (!error && (!data || !data.getFieldsByType)) {
    return <FieldsSkeleton />;
  } else if (error) {
    return <ErrorLoading error={error} />;
  }

  return (
    <>
      {data.getFieldsByType.data.map((field) => (
        <ItemOneFields
          parentId={parentId}
          field={field}
          key={field._id}
          showAuthor={showAuthor}
          guest={guest}
        />
      ))}
    </>
  );
}