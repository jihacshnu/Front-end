import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Link from 'next/link';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ModeCommentIcon from '@material-ui/icons/ModeComment';
import moment from 'moment';
import ImageList from './ImageList';
import MentionParser from '../common/MentionParser';

interface IProps {
  post: any;
  onClickMore?: (arg1: any, arg2: any) => void;
  authenticated?: boolean;
}

export default function PostCard({ post, onClickMore = () => {}, authenticated = true }: IProps) {
  return (
    <Card className="my-3" variant="outlined">
      <CardHeader
        avatar={
          <Avatar aria-label="author" alt={post.createdBy.name} src={post.createdBy.picture} />
        }
        action={
          <IconButton
            aria-label="settings"
            onClick={(event) => onClickMore(event.currentTarget, post)}>
            <MoreVertIcon />
          </IconButton>
        }
        title={<Link href={`/user/${post.createdBy._id}`}>{post.createdBy.name}</Link>}
        subheader={
          moment(post.createdAt) > moment().subtract(7, 'days')
            ? moment(post.createdAt).fromNow()
            : moment(post.createdAt).format('LL')
        }
        // subheader={moment(post.createdAt).fromNow()}
        // subheader={moment(post.createdAt).format('LLL')}
      />
      <CardContent>
        <MentionParser value={post.body} className="mb-1" authenticated={authenticated} />
        <ImageList media={post.media} authenticated={authenticated} />
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="like">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="comment">
          <ModeCommentIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}