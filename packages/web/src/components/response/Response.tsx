import { useSelector } from 'react-redux';
import { Fragment, useState } from 'react';
import { useGetForm } from '@frontend/shared/hooks/form';
import { useDeleteResponse, useGetResponse } from '@frontend/shared/hooks/response';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import { useUpdateSection } from '@frontend/shared/hooks/section';
import EditIcon from '@mui/icons-material/Edit';
import { useAuthorization } from '@frontend/shared/hooks/auth';
import ListItemText from '@mui/material/ListItemText';
import moment from 'moment';
import { Paper, Box, Grid, List, ListItem, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getUserName } from '@frontend/shared/hooks/user/getUserForm';
import { parseResponse } from '@frontend/shared/hooks/response/getResponse';
import EditResponseDrawer from './EditResponseDrawer';
import Breadcrumbs from '../common/Breadcrumbs';
import DisplayValue from '../form2/DisplayValue';
import NotFound from '../common/NotFound';
import CommentLikeShare from '../common/commentLikeShare/CommentLikeShare';
import StarRating from '../starRating/starRating';
import ErrorLoading from '../common/ErrorLoading';
import { QRButton } from '../qrcode/QRButton';
import ResponseSections from './ResponseSection';
import FormFieldsValue from '../form2/FormFieldsValue';
import { onAlert } from '../../utils/alert';
import CRUDMenu from '../common/CRUDMenu';
import BackdropComponent from '../common/Backdrop';
import EditMode from '../common/EditMode';
import DisplayFormulaValue from '../form2/formula/DisplayFormulaValue';

const StyledBox = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row !important',
  },
}));

interface IProps {
  responseId: string;
  hideBreadcrumbs?: boolean;
  hideNavigation?: boolean;
  hideAuthor?: boolean;
  hideWorkflow?: boolean;
  deleteCallBack?: () => void;
}

export default function Response({
  responseId,
  hideBreadcrumbs,
  hideNavigation,
  hideAuthor,
  hideWorkflow,
  deleteCallBack,
}: IProps) {
  const { data, error } = useGetResponse(responseId);

  if (error || !data?.getResponse) {
    return <ErrorLoading error={error} />;
  }

  // if (!data?.getResponse) {
  //   return <NotFound />;
  // }

  return (
    <ResponseChild2
      response={data?.getResponse}
      formId={data?.getResponse?.formId}
      hideBreadcrumbs={hideBreadcrumbs}
      hideNavigation={hideNavigation}
      hideAuthor={hideAuthor}
      hideWorkflow={hideWorkflow}
      deleteCallBack={deleteCallBack}
    />
  );
}

interface IProps2 {
  formId: any;
  response: any;
  hideBreadcrumbs?: boolean;
  hideNavigation?: boolean;
  hideAuthor?: boolean;
  hideWorkflow?: boolean;
  isAuthorized?: boolean;
  deleteCallBack?: () => void;
}

export function ResponseChild2({
  formId,
  response,
  hideBreadcrumbs,
  hideNavigation,
  hideAuthor,
  hideWorkflow,
  isAuthorized,
  deleteCallBack,
}: IProps2) {
  const { data, error, loading } = useGetForm(formId);

  if (error || !data || loading) {
    return <ErrorLoading error={error} />;
  }

  if (!data?.getForm) {
    return <NotFound />;
  }

  return (
    <ResponseChild3
      response={response}
      form={data?.getForm}
      hideBreadcrumbs={hideBreadcrumbs}
      hideNavigation={hideNavigation}
      hideAuthor={hideAuthor}
      hideWorkflow={hideWorkflow}
      isAuthorized={isAuthorized}
      deleteCallBack={deleteCallBack}
    />
  );
}

interface IProps3 {
  form: any;
  response: any;
  hideBreadcrumbs?: boolean;
  hideNavigation?: boolean;
  hideAuthor?: boolean;
  hideWorkflow?: boolean;
  deleteCallBack?: () => void;
  isAuthorized?: boolean;
}

export function ResponseChild3({
  form,
  response: tempResponse,
  hideBreadcrumbs,
  hideNavigation,
  hideAuthor,
  hideWorkflow,
  deleteCallBack,
  isAuthorized,
}: IProps3) {
  const [state, setState] = useState({ showMenu: null, edit: false, showBackdrop: false });

  const { handleDelete, deleteLoading } = useDeleteResponse({ onAlert });
  const response = parseResponse(tempResponse);
  const authorized =
    useAuthorization([response?.createdBy?._id, form?.createdBy?._id], true) || isAuthorized;
  const authorized2 = useAuthorization([form?.createdBy?._id], true);
  const { section, onSectionChange, handleUpdateSection } = useUpdateSection({
    onAlert,
    _id:
      (typeof response?.options === 'string' ? JSON.parse(response?.options) : response?.options)
        ?.customSectionId || form._id,
  });
  const { editMode } = useSelector(({ setting }: any) => setting);

  const userForm = useSelector(({ setting }: any) => setting.userForm);

  const hideLeftNavigation = !(hideAuthor || hideNavigation || hideBreadcrumbs);

  return (
    <>
      <BackdropComponent open={deleteLoading || state.showBackdrop} />
      {!hideBreadcrumbs ? (
        <div className="d-flex justify-content-between align-items-center">
          {!hideNavigation && (
            <Breadcrumbs>
              <Link href="/forms">Forms</Link>
              <Link href={`/forms/${form.slug}`}>{form?.name}</Link>
              <Typography>Response</Typography>
            </Breadcrumbs>
          )}
          <div className="d-flex align-items-center">
            {!hideNavigation && (
              <>
                <EditMode />
                <QRButton />
              </>
            )}
            {authorized && (
              <Tooltip title="Edit Response">
                <IconButton
                  onClick={(e) => setState({ ...state, showMenu: e.currentTarget })}
                  size="large"
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </div>
      ) : (
        authorized && (
          <Tooltip title="Edit Response">
            <IconButton
              onClick={(e) => setState({ ...state, showMenu: e.currentTarget })}
              size="large"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        )
      )}
      {authorized && (
        <>
          <CRUDMenu
            show={state.showMenu}
            onEdit={() => setState({ ...state, showMenu: null, edit: true })}
            onDelete={() => {
              setState({ ...state, showMenu: null });
              handleDelete(response?._id, deleteCallBack);
            }}
            onClose={() => setState({ ...state, showMenu: null })}
          />
          {state.edit && (
            <>
              <EditResponseDrawer
                form={form}
                response={response}
                open={state.edit}
                onClose={() => {
                  setState({ ...state, edit: false });
                }}
              />
            </>
          )}
        </>
      )}
      <Grid container spacing={1}>
        {hideLeftNavigation && (
          <Grid item xs={3}>
            <div
              className={`d-flex ${
                section?.options?.belowResponse ? 'flex-column-reverse' : 'flex-column'
              }`}
            >
              <ResponseSections
                authorized={false}
                section={section}
                onSectionChange={(sec) => null}
              />
              <Paper variant="outlined">
                <List dense component="nav">
                  <ListItem button>
                    <ListItemText primary="Form Fields" />
                  </ListItem>
                  {form?.fields?.map((field) => (
                    <ListItem button key={field._id}>
                      <ListItemText primary={field?.label} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </div>
          </Grid>
        )}
        <Grid item xs={!hideLeftNavigation ? 12 : 9}>
          {response?.workFlowFormResponseParentId && section?.options?.showRelation && (
            <Response
              responseId={response?.workFlowFormResponseParentId}
              hideBreadcrumbs
              hideWorkflow
            />
          )}
          <Paper
            variant="outlined"
            style={!hideLeftNavigation ? { border: 'none' } : {}}
            className={`d-flex ${
              section?.options?.belowResponse ? 'flex-column-reverse' : 'flex-column'
            }`}
          >
            {!hideWorkflow && section?.fields?.length > 0 && (
              <FormFieldsValue
                authorized={authorized2}
                disableGrid={!editMode}
                fields={section?.fields}
                values={section?.values}
                layouts={section?.options?.layouts || {}}
                handleValueChange={handleUpdateSection}
                onLayoutChange={(layouts) =>
                  onSectionChange({
                    options: { ...section?.options, layouts },
                  })
                }
                workFlowFormResponseParentId={response?._id}
              />
            )}
            <div className="p-2">
              {!hideAuthor && (
                <>
                  <Typography variant="body1">
                    {`by ${getUserName(userForm, response?.createdBy)} `}
                  </Typography>
                  <Typography variant="body2">
                    {`created at ${moment(response?.createdAt).format('l')} ${moment(
                      response?.createdAt,
                    ).format('LT')}`}
                  </Typography>
                </>
              )}
              {form?.fields?.map((field) => {
                return (
                  <Fragment key={field?._id}>
                    <div className="mt-2">
                      <Typography fontWeight="bold">- {field?.label}</Typography>
                      {field?.options?.systemCalculatedAndView ? (
                        <DisplayFormulaValue
                          formula={field?.options?.formula}
                          field={field}
                          values={response?.values}
                        />
                      ) : (
                        <>
                          {response?.values
                            ?.filter((v) => v.field === field._id)
                            .map((value) => (
                              <Fragment key={value?._id}>
                                <StyledBox style={{ display: 'flex', alignContent: 'center' }}>
                                  <DisplayValue field={field} value={value} verticalView />
                                </StyledBox>
                                {field?.options?.showCommentBox && (
                                  <CommentLikeShare parentId={value?._id} />
                                )}
                                {field?.options?.showStarRating && (
                                  <StarRating parentId={value?._id} />
                                )}
                              </Fragment>
                            ))}
                        </>
                      )}
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
