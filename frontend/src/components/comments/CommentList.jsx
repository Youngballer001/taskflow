import CommentItem from './CommentItem';
import EmptyState from '../common/EmptyState';
export default function CommentList({ comments = [], canDelete, canEdit, onDelete, onEdit }) { return comments.length ? <div className="comment-list">{comments.map((comment) => <CommentItem key={comment.id} comment={comment} canDelete={canDelete?.(comment)} canEdit={canEdit?.(comment)} onDelete={onDelete} onEdit={onEdit} />)}</div> : <EmptyState title="No comments yet" description="Start the conversation on this task." />; }
