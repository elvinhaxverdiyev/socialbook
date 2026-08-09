import Modal from '../ui/Modal';
import PostCard from './PostCard';
import EmptyState from '../ui/EmptyState';
import { useApp } from '../../context/AppContext';
import { FileText } from 'lucide-react';

export default function PostDetailModal() {
  const { posts, viewedPostId, closePost } = useApp();

  if (viewedPostId == null) return null;

  const post = posts.find((p) => p.id === viewedPostId);

  return (
    <Modal
      title="Paylaşım"
      onClose={closePost}
      size="lg"
      className="post-detail-modal"
      cardClassName="post-detail-modal__card"
      overlayClassName="post-detail-modal__overlay"
    >
      {post ? (
        <div className="post-detail-modal__content">
          <PostCard post={post} />
        </div>
      ) : (
        <EmptyState text="Bu paylaşım tapılmadı." icon={FileText} />
      )}
    </Modal>
  );
}
