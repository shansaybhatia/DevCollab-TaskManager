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
    setIsSaving(true);
    try {
      await updateProfile({ name: name.trim(), bio: bio.trim() });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
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
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Avatar size must be less than 2MB');
      return;
    }

    setIsUploading(true);
    try {
      await uploadAvatar(file);
      toast.success('Avatar updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Developer Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1.5">
          Manage your account credentials and personal preferences.
        </p>
      </div>

      <div className="glass-panel p-8 space-y-6 shadow-xl border-slate-200/90 bg-white/90">
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
              className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
            <p className="font-bold text-base text-slate-900">
              {user?.name || 'Developer'}
            </p>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
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

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Engineering focus, team role, or notes…"
              rows={3}
              className="w-full rounded-[var(--radius-btn)] border border-slate-200 bg-white px-4 py-2.5
                text-sm text-slate-900 placeholder:text-slate-400
                focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                transition-colors duration-200 resize-none shadow-xs"
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
