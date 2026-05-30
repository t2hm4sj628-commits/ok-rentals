import { ExternalBlob, createActor } from "@/backend";
import type { BlogPost } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminCreateBlogPost,
  useAdminDeleteBlogPost,
  useAdminListAllBlogPosts,
  useAdminUpdateBlogPost,
} from "@/hooks/useBackend";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  Calendar,
  Camera,
  Check,
  FileText,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "sonner";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 60);
}

function formatDate(ts: bigint): string {
  const d = new Date(Number(ts));
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface BlogFormData {
  title: string;
  slug: string;
  author: string;
  excerpt: string;
  featuredImage: string;
  content: string;
  publishedDate: string;
  published: boolean;
}

const EMPTY_FORM: BlogFormData = {
  title: "",
  slug: "",
  author: "",
  excerpt: "",
  featuredImage: "",
  content: "",
  publishedDate: new Date().toISOString().split("T")[0],
  published: false,
};

function BlogPostModal({
  post,
  onClose,
}: {
  post: BlogPost | null;
  onClose: () => void;
}) {
  const { actor } = useActor(createActor);
  const [form, setForm] = useState<BlogFormData>(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const createPost = useAdminCreateBlogPost();
  const updatePost = useAdminUpdateBlogPost();

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title,
        slug: post.slug,
        author: post.author,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        content: post.content,
        publishedDate: new Date(Number(post.publishedDate))
          .toISOString()
          .split("T")[0],
        published: post.published,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setPhotoFile(null);
    setPhotoPreview("");
  }, [post]);

  function upd(k: keyof BlogFormData, v: string | boolean) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleTitleChange(value: string) {
    setForm((f) => {
      const next = { ...f, title: value };
      // Auto-generate slug on first type if slug is empty
      if (!post && !f.slug && value) {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    const preview = URL.createObjectURL(file);
    setPhotoFile(file);
    setPhotoPreview(preview);
  }

  async function handleSave() {
    if (!actor) {
      toast.error("Not connected");
      return;
    }
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.slug.trim()) {
      toast.error("Slug is required");
      return;
    }
    setSaving(true);
    try {
      let finalImageUrl = form.featuredImage;
      if (photoFile) {
        const bytes = new Uint8Array(await photoFile.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes);
        const backend = actor as unknown as {
          _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>;
          _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>;
        };
        const reference = await backend._uploadFile(blob);
        const downloaded = await backend._downloadFile(reference);
        finalImageUrl = downloaded.getDirectURL();
      }

      const publishedDateMs = new Date(form.publishedDate).getTime();

      if (post) {
        const result = await updatePost.mutateAsync({
          id: post.id,
          title: form.title,
          slug: form.slug,
          author: form.author,
          excerpt: form.excerpt,
          featuredImage: finalImageUrl,
          content: form.content,
          publishedDate: BigInt(publishedDateMs),
          published: form.published,
        });
        if (result.__kind__ === "err") throw new Error(result.err);
        toast.success("Blog post updated");
      } else {
        const result = await createPost.mutateAsync({
          title: form.title,
          slug: form.slug,
          author: form.author,
          excerpt: form.excerpt,
          featuredImage: finalImageUrl,
          content: form.content,
          publishedDate: BigInt(publishedDateMs),
          published: form.published,
        });
        if (result.__kind__ === "err") throw new Error(result.err);
        toast.success("Blog post created");
      }
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      onClose();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display text-lg font-bold">
            {post ? "Edit Blog Post" : "New Blog Post"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="blog.modal_close_button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest">Title</Label>
            <Input
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Post title..."
              data-ocid="blog.title_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest">Slug</Label>
            <Input
              value={form.slug}
              onChange={(e) => upd("slug", e.target.value)}
              placeholder="url-friendly-slug"
              data-ocid="blog.slug_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest">Author</Label>
            <Input
              value={form.author}
              onChange={(e) => upd("author", e.target.value)}
              placeholder="Author name"
              data-ocid="blog.author_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest">Excerpt</Label>
            <Textarea
              value={form.excerpt}
              onChange={(e) => upd("excerpt", e.target.value)}
              placeholder="Short summary (max 200 chars)..."
              rows={2}
              maxLength={200}
              data-ocid="blog.excerpt_textarea"
            />
            <p className="text-xs text-muted-foreground text-right">
              {form.excerpt.length}/200
            </p>
          </div>

          {/* Featured Image */}
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest">
              Featured Image
            </Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              aria-label="Upload featured image from gallery"
              onChange={handleFileSelect}
              data-ocid="blog.image_input"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              aria-label="Take photo with camera"
              onChange={handleFileSelect}
            />
            {(photoPreview || form.featuredImage) && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border bg-secondary/30">
                <img
                  src={photoPreview || form.featuredImage}
                  alt="Featured preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/images/placeholder.svg";
                  }}
                />
                {photoFile && (
                  <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs px-2 py-0.5 rounded-full font-medium">
                    New — saves on Submit
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 text-xs uppercase tracking-widest"
                data-ocid="blog.upload_button"
              >
                <Upload className="w-4 h-4 mr-1.5" /> Upload Photo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => cameraInputRef.current?.click()}
                className="text-xs uppercase tracking-widest"
                data-ocid="blog.camera_button"
                aria-label="Take photo with camera"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Or paste a URL:</p>
            <Input
              value={photoFile ? "" : form.featuredImage}
              onChange={(e) => {
                setPhotoFile(null);
                setPhotoPreview("");
                upd("featuredImage", e.target.value);
              }}
              placeholder="https://..."
              className="text-xs"
              data-ocid="blog.image_url_input"
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest">Content</Label>
            <div className="bg-background border border-border rounded-md">
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={(v: string) => upd("content", v)}
                placeholder="Write your blog post content..."
                className="min-h-[200px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest">
                Published Date
              </Label>
              <Input
                type="date"
                value={form.publishedDate}
                onChange={(e) => upd("publishedDate", e.target.value)}
                data-ocid="blog.date_input"
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch
                checked={form.published}
                onCheckedChange={(v) => upd("published", v)}
                data-ocid="blog.published_switch"
              />
              <Label className="text-sm">Published</Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-ocid="blog.modal_cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving || createPost.isPending || updatePost.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="blog.modal_save_button"
          >
            {saving || createPost.isPending || updatePost.isPending ? (
              "Saving..."
            ) : (
              <>
                <Check className="w-4 h-4 mr-1" /> Save Post
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({
  post,
  onClose,
}: {
  post: BlogPost;
  onClose: () => void;
}) {
  const deletePost = useAdminDeleteBlogPost();

  function handleDelete() {
    deletePost.mutate(post.id, {
      onSuccess: () => {
        toast.success("Blog post deleted");
        onClose();
      },
      onError: (e) => toast.error((e as Error).message),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl w-full max-w-sm p-6 shadow-2xl">
        <h3 className="font-display text-lg font-bold mb-2">Delete Post?</h3>
        <p className="text-muted-foreground text-sm mb-6">
          This will permanently remove{" "}
          <strong className="text-foreground">{post.title}</strong>.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-ocid="blog.delete_cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deletePost.isPending}
            data-ocid="blog.delete_confirm_button"
          >
            {deletePost.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function BlogTab() {
  const { data: posts = [], isLoading } = useAdminListAllBlogPosts();
  const [editPost, setEditPost] = useState<BlogPost | null | "new">(null);
  const [deletePost, setDeletePost] = useState<BlogPost | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="blog.loading_state">
        {[1, 2, 3].map((k) => (
          <Skeleton key={k} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ocid="blog.section">
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => setEditPost("new")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-xs"
          data-ocid="blog.new_post_button"
        >
          <Plus className="w-4 h-4 mr-1" /> New Post
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Title
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Author
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Date
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, i) => (
              <tr
                key={post.id.toString()}
                className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors"
                data-ocid={`blog.item.${i + 1}`}
              >
                <td className="px-4 py-3">
                  <p className="font-semibold text-foreground">{post.title}</p>
                  <p className="text-xs text-muted-foreground">/{post.slug}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {post.author}
                </td>
                <td className="px-4 py-3">
                  {post.published ? (
                    <Badge
                      variant="outline"
                      className="text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
                    >
                      Published
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-xs border-yellow-500/30 text-yellow-400 bg-yellow-500/5"
                    >
                      Draft
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 shrink-0" />
                    {formatDate(post.publishedDate)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditPost(post)}
                      className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Edit"
                      data-ocid={`blog.edit_button.${i + 1}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletePost(post)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Delete"
                      data-ocid={`blog.delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
          <div
            className="py-12 text-center text-muted-foreground text-sm"
            data-ocid="blog.empty_state"
          >
            <FileText className="w-8 h-8 mx-auto mb-3 text-muted-foreground/40" />
            No blog posts yet. Create one to get started.
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {posts.map((post, i) => (
          <div
            key={post.id.toString()}
            className="bg-card border border-border rounded-xl p-4 space-y-2"
            data-ocid={`blog.item.${i + 1}`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-foreground truncate flex-1">
                {post.title}
              </p>
              {post.published ? (
                <Badge
                  variant="outline"
                  className="text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/5 shrink-0"
                >
                  Published
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-xs border-yellow-500/30 text-yellow-400 bg-yellow-500/5 shrink-0"
                >
                  Draft
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {post.author} · {formatDate(post.publishedDate)}
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEditPost(post)}
                className="p-1.5 text-muted-foreground hover:text-primary"
                aria-label="Edit"
                data-ocid={`blog.mobile_edit_button.${i + 1}`}
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeletePost(post)}
                className="p-1.5 text-muted-foreground hover:text-destructive"
                aria-label="Delete"
                data-ocid={`blog.mobile_delete_button.${i + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div
            className="py-12 text-center text-muted-foreground text-sm"
            data-ocid="blog.empty_state"
          >
            <FileText className="w-8 h-8 mx-auto mb-3 text-muted-foreground/40" />
            No blog posts yet.
          </div>
        )}
      </div>

      {editPost !== null && (
        <BlogPostModal
          post={editPost === "new" ? null : editPost}
          onClose={() => setEditPost(null)}
        />
      )}
      {deletePost && (
        <DeleteConfirm post={deletePost} onClose={() => setDeletePost(null)} />
      )}
    </div>
  );
}
