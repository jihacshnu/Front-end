import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

interface IProps {
  onEdit?: () => void;
  onDelete?: () => void;
  hideEdit?: boolean;
  hideDelete?: boolean;
}

export default function ActionButtons({
  onEdit,
  onDelete,
  hideEdit = false,
  hideDelete = false,
}: IProps) {
  return (
    <div className="d-flex align-content-center align-items-center">
      {!hideEdit && (
        <Tooltip title="Edit">
          <Button
            onClick={onEdit}
            className="mr-2"
            size="small"
            variant="outlined"
            component="span"
            color="primary"
            startIcon={<EditIcon />}>
            Edit
          </Button>
        </Tooltip>
      )}
      {!hideDelete && (
        <Tooltip title="Delete">
          <Button
            onClick={onDelete}
            size="small"
            variant="outlined"
            component="span"
            color="primary"
            startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </Tooltip>
      )}
    </div>
  );
}