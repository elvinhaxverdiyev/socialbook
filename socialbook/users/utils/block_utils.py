from django.db.models import Exists, OuterRef, Q

from users.models.block_models import BlockedUser


def is_blocked_between(user_a, user_b):
    if not user_a or not user_b:
        return False
    if not getattr(user_a, "is_authenticated", False):
        return False
    if user_a.pk == user_b.pk:
        return False

    return BlockedUser.objects.filter(
        Q(blocker=user_a, blocked=user_b) | Q(blocker=user_b, blocked=user_a),
    ).exists()


def raise_if_blocked(viewer, target):
    if is_blocked_between(viewer, target):
        from rest_framework.exceptions import PermissionDenied

        raise PermissionDenied("Bu istifadəçi ilə qarşılıqlı blok var.")


def post_author(post):
    if post.user_id:
        return post.user
    return None


def raise_if_post_blocked(viewer, post):
    author = post_author(post)
    if author:
        raise_if_blocked(viewer, author)


def blocked_user_exists_subquery(viewer):
    """Post.visible_to() üçün Exists subquery."""
    blocked = BlockedUser.objects.filter(
        blocker=viewer,
        blocked_id=OuterRef("user_id"),
    )
    blocked_by = BlockedUser.objects.filter(
        blocked=viewer,
        blocker_id=OuterRef("user_id"),
    )
    return Exists(blocked) | Exists(blocked_by)
