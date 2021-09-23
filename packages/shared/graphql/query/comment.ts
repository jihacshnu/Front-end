import { gql } from '@apollo/client';

export const GET_COMMENTS_BY_PARENT_ID = gql`
  query MyQuery($parentId: ID!) {
    getCommentsByParentID(parentId: $parentId) {
      data {
        body
        _id
        createdAt
        updatedAt
        parentId
        createdBy {
          name
          picture
          _id
        }
      }
    }
  }
`;

export const GET_COMMENTCOUNT = gql`
  query MyQuery($parentId: ID!) {
    getCommentCount(parentId: $parentId) {
      count
    }
  }
`;

export const GET_ACTION_COUNTS = gql`
  query MyQuery($parentId: ID!) {
    getActionCounts(parentId: $parentId) {
      commentCount
      likeCount
      likedByUser {
        like
      }
    }
  }
`;
