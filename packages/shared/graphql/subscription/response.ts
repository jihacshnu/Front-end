import { gql } from '@apollo/client';

export const RESPONSE_SUB = gql`
  subscription MySubscription($formId: ID!) {
    responseSub(formId: $formId) {
      _id
      formId
      parentId
      values {
        _id
        field
        value
        valueNumber
        valueBoolean
        valueDate
        itemId {
          _id
          title
          slug
        }
        media {
          url
          caption
        }
      }
      createdBy {
        _id
        picture
        name
      }
      createdAt
    }
  }
`;

export const DELETED_RESPONSE = gql`
  subscription MySubscription {
    deletedResponse
  }
`;
