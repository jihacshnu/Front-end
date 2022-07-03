// import Link from 'next/link';
import { Fragment } from 'react';
import moment from 'moment';
import Avatar from '@mui/material/Avatar';
import { Box, Typography } from '@mui/material';
import { IField } from '@frontend/shared/types/form';
import slugify from 'slugify';
import Link from 'next/link';
import DisplayRichText from '../common/DisplayRichText';
import { ShowResponseLabel } from '../response/ResponseDrawer';
// import PageDrawer from '../template/PageDrawer';
import ImageList from '../post/ImageList';
import DisplayFiles from '../fileLibrary/DisplayFiles';
import { LighthouseReport } from './LighthouseReportRendrer';
import DisplayBoard from './board/DisplayBoard';
import DisplayDiagram from '../syncfusion-diagram/DisplayDiagram';
import ReactFlow from '../react-flow/ReactFlow';

interface IProps {
  field: Partial<IField>;
  value: any;
  imageAvatar?: boolean;
  verticalView?: boolean;
}

export default function DisplayValue({
  field,
  value: tempValue,
  imageAvatar,
  verticalView,
}: IProps) {
  const value: any = { ...tempValue };
  if (typeof value?.options === 'string') {
    value.options = JSON.parse(value?.options);
  }
  if (
    field?.options?.selectItem &&
    field?.options?.showAsCheckbox &&
    !['response'].includes(field.fieldType)
  ) {
    return (
      <>
        {value?.values?.map((v, i) => (
          <Fragment key={i}>
            {v}
            <br />
          </Fragment>
        ))}
      </>
    );
  }
  switch (field.fieldType) {
    case 'text':
    case 'textarea':
    case 'url':
    case 'email':
    case 'password':
      return <>{value?.value}</>;
    case 'response':
      return <ShowResponseLabel formField={field.options?.formField} response={value?.response} />;
    case 'form':
      return value?.form?.name ? (
        <Link href={`/forms/${slugify(value?.form?.name, { lower: true })}`}>
          <a>
            <Typography color="primary">{value?.form?.name}</Typography>
          </a>
        </Link>
      ) : (
        <Typography>NA</Typography>
      );
    // case 'select': {
    //   let optionsTemplate = field.options?.optionsTemplate || value?.options?.optionsTemplate;
    //   let valueFormField = value?.options?.formField;
    //   if (typeof value?.options === 'string') {
    //     optionsTemplate =
    //       field.options?.optionsTemplate || JSON.parse(value?.options)?.optionsTemplate;
    //     valueFormField = JSON.parse(value?.options)?.formField;
    //   }
    //   if (optionsTemplate === 'template') {
    //     if ((field?.template?._id || value.template?._id) && value.page) {
    //       return <PageDrawer title={value.page?.title} slug={value.page?.slug} />;
    //     }
    //     if (value?.template?.slug && value?.template?.title) {
    //       return <Link href={`/${value?.template?.slug}`}>{value?.template?.title}</Link>;
    //     }
    //     return null;
    //   }
    //   if (optionsTemplate === 'response') {
    //     if (
    //       ((field?.form?._id && field?.options?.formField) ||
    //         (value?.form?._id && valueFormField)) &&
    //       value?.response
    //     ) {
    //       return (
    //         <ShowResponseLabel
    //           formField={field?.form?._id ? field.options?.formField : valueFormField}
    //           response={value?.response}
    //         />
    //       );
    //     }
    //     return <>{value?.form?.name}</>;
    //   }
    //   if (field?.options?.showAsCheckbox) {
    //     return (
    //       <>
    //         {value?.values?.map((v, i) => (
    //           <Fragment key={i}>
    //             {v}
    //             <br />
    //           </Fragment>
    //         ))}
    //       </>
    //     );
    //   }
    //   return <DisplayValue field={{ fieldType: optionsTemplate }} value={value} />;
    // }
    case 'link':
      return <a href={value?.value}>{value?.value}</a>;
    case 'richTextarea':
      return <DisplayRichText value={value?.value} />;
    case 'date':
      return <>{value?.valueDate && moment(value?.valueDate).format('L')}</>;
    case 'dateTime':
      return <>{value?.valueDate && moment(value?.valueDate).format('lll')}</>;
    case 'number':
    case 'phoneNumber':
      return <>{value?.valueNumber}</>;
    case 'unitQuantity':
      return (
        <>
          {value?.valueNumber} {value?.options?.unit}
        </>
      );
    case 'boolean':
      return <>{value?.valueBoolean ? 'Yes' : 'No'}</>;
    case 'image':
      if (imageAvatar) {
        return (
          <>
            {value?.media?.map((image, i) => (
              <Avatar key={i} alt={`image-${i + 1}`} src={image?.url} />
            ))}
          </>
        );
      }
      return (
        <ImageList
          media={value?.tempMedia ? [...value?.media, ...value?.tempMedia] : value?.media}
        />
      );
    case 'file': {
      return <DisplayFiles urls={[value?.value]} />;
    }
    case 'address': {
      const address = value?.value?.split('+');
      const addressKey = ['Address', 'Landmark', 'City', 'State', 'Country'];
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {address.map((res, index) => (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <b>{res !== '' && `${addressKey[index]}: `} </b>
              <Typography sx={{ marginLeft: '5px' }} key={index}>
                {res !== '' && `${res},`}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    case 'lighthouseReport':
      return (
        <>
          {field?.options?.systemCalculatedAndSaved ? (
            <LighthouseReport report={value?.value} />
          ) : (
            <>{value?.value}</>
          )}
        </>
      );
    case 'board':
      return <DisplayBoard board={value?.options?.board} verticalView={verticalView} />;
    case 'diagram':
      return <DisplayDiagram diagram={value?.options?.diagram} />;
    case 'flowDiagram':
      return <ReactFlow flow={value?.options?.flowDiagram} />;
    default:
      return <>{value?.value}</>;
  }
}
