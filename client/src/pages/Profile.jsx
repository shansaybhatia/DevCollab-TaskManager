import { useState, useRef } from 'react';
import { Camera, Save } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile, uploadAvatar } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef(null);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    setIsSaving(true);
    try {
      await updateProfile({ name: name.trim(), bio: bio.trim() });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    setIsUploading(true);
    try {
      await uploadAvatar(file);
      toast.success('Avatar updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-ink)] tracking-tight">
          Developer Profile
        </h1>
        <p className="text-sm text-[var(--color-muted)] mt-1.5">
          Manage your account credentials and personal preferences.
        </p>
      </div>

      <div className="glass-panel p-8 space-y-6 shadow-2xl">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative group">
            <Avatar
              src={user?.avatar}
              name={user?.name || ''}
              size="xl"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={isUploading}
              className="absolute inset-0 flex items-center justify-center rounded-[var(--radius-pill)] bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Upload avatar image"
            >
              <Camera className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <p className="font-bold text-base text-[var(--color-ink)]">
              {user?.name || 'Developer'}
            </p>
            <p className="text-xs text-[var(--color-muted)] font-mono mt-0.5">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />

          <div className="space-y-2 text-left">
            <label className="block text-xs font-medium text-[var(--color-ink-2)] tracking-wide">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Engineering focus, team role, or notes..."
              rows={3}
              className="w-full rounded-[var(--radius-pill)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-4 py-3
                text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)]
                focus:border-[var(--color-focus)] focus:bg-[var(--color-paper-3)] focus:outline-none
                transition-colors duration-200 resize-none"
            />
          </div>

          <div className="flex justify-end pt-3">
            <Button type="submit" isLoading={isSaving} icon={Save} size="md">
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
