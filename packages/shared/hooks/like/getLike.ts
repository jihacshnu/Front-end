import { useEffect } from 'react';
import { useQuery, useSubscription } from '@apollo/client';

import { GET_LIKES_BY_PARENT_ID } from '../../graphql/query/like';
import { ADDED_LIKE } from '../../graphql/subscription/like';
import { updateLikeInCache } from './createLike';

export const useGetLikes = (parentId: string) => {
  const { data, error, loading, subscribeToMore } = useQuery(GET_LIKES_BY_PARENT_ID, {
    variables: {
      parentId,
    },
    fetchPolicy: 'cache-and-network',
  });

  return { data, error, loading };
};

export const useLikeSubscription = () => {
  const { data: likeData, loading: likeLoading, error: likeError } = useSubscription(ADDED_LIKE);

  useEffect(() => {
    if (likeData && likeData.addedLike) {
      updateLikeInCache(likeData.addedLike.parentId, 1);
    }
  }, [likeData]);
};
