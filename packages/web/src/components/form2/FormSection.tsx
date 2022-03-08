import { useState } from 'react';
import { useGetResponses } from '@frontend/shared/hooks/response';
import Button from '@material-ui/core/Button';
// import AddIcon from '@material-ui/icons/Add';
// import { IconButton } from '@material-ui/core';
// import CloseIcon from '@material-ui/icons/Close';
// import Response from '../response/Response';
import FieldViewWrapper from './FieldViewWrapper';
import ErrorLoading from '../common/ErrorLoading';
import Overlay from '../common/Overlay';

export const DisplayForm = ({
  formId,
  parentId,
  authorized,
  customSettings,
}: {
  formId: string;
  parentId: string;
  authorized: boolean;
  customSettings: any;
}) => {
  const { data, error, refetch } = useGetResponses(formId, parentId);
  const [state, setState] = useState({ drawer: false, showForm: false });

  const handleRefetch = () => {
    refetch();
  };

  if (error || !data) {
    return <ErrorLoading error={error} />;
  }

  return (
    <>
      <FieldViewWrapper _id={formId} parentId={parentId} customSettings={customSettings} />
      {/* //  : authorized && !(data?.getResponses && data?.getResponses?.count > 0) ? (
      //   <FieldViewWrapper _id={formId} parentId={parentId} customSettings={customSettings} />
      // ) : (
      //   (authorized || customSettings?.showResponses) && (
      //     <>
      //       {customSettings?.multipleResponses && (
      //         <>
      //           {state.showForm ? (
      //             <>
      //               <div className="text-right">
      //                 <IconButton
      //                   size="small"
      //                   onClick={() => setState({ ...state, showForm: false })}
      //                 >
      //                   <CloseIcon />
      //                 </IconButton>
      //               </div>
      //               <FieldViewWrapper
      //                 _id={formId}
      //                 parentId={parentId}
      //                 customSettings={customSettings}
      //                 createCallback={(r) => {
      //                   handleRefetch();
      //                   setState({ ...state, showForm: false });
      //                 }}
      //               />
      //             </>
      //           ) : (
      //             authorized && (
      //               <Button
      //                 variant="contained"
      //                 color="primary"
      //                 size="small"
      //                 startIcon={<AddIcon />}
      //                 onClick={() => setState({ ...state, showForm: true })}
      //               >
      //                 Add new
      //               </Button>
      //             )
      //           )}
      //         </>
      //       )}
      //       {(customSettings?.multipleResponses
      //         ? data?.getResponses?.data
      //         : [data?.getResponses?.data?.[0]]
      //       )
      //         ?.slice(0)
      //         .reverse()
      //         ?.map((response) => (
      //           <Response
      //             key={response?._id}
      //             hideNavigation
      //             hideAuthor
      //             responseId={response?._id}
      //           />
      //         ))}
      //     </>
      //   )
      // )} */}
    </>
  );
};
