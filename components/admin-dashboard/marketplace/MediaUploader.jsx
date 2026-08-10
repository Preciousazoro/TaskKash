import React, { useState } from "react";
import { Upload, Image as ImageIcon, Film, FileText, X, Link } from "lucide-react";

function ImageDropzone({ label, hint, icon: Icon, file, onChange, tall, uploading }) {
  return (
    <div>
      <span className="text-xs font-semibold text-muted-foreground mb-2 block">{label}</span>
      <label
        className={`flex flex-col items-center justify-center gap-2 border border-dashed border-border rounded-xl cursor-pointer hover:border-purple-500/40 hover:bg-muted/20 transition-colors ${
          tall ? "h-32" : "h-24"
        } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) onChange(file);
          }} 
        />
        {uploading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
            <span className="text-[11px] text-muted-foreground">Uploading...</span>
          </div>
        ) : file ? (
          <div className="flex items-center gap-2 px-3">
            <Icon size={16} className="text-green-500" />
            <span className="text-xs text-foreground truncate max-w-[160px]">{typeof file === 'string' ? 'Image uploaded' : file.name}</span>
            <button
              onClick={(e) => { e.preventDefault(); onChange(null); }}
              className="text-muted-foreground hover:text-red-500"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <>
            <Icon size={18} className="text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">{hint}</span>
          </>
        )}
      </label>
    </div>
  );
}

function UrlInput({ label, hint, icon: Icon, value, onChange }) {
  return (
    <div>
      <span className="text-xs font-semibold text-muted-foreground mb-2 block">{label}</span>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Link size={16} />
        </div>
        <input
          type="url"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full pl-10 pr-10 py-2.5 text-xs border border-border rounded-lg focus:outline-none focus:border-purple-500/50 bg-background"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-red-500"
          >
            <X size={13} />
          </button>
        )}
      </div>
      {hint && <p className="text-[10px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

export default function MediaUploader({ media, setMedia }) {
  const [uploading, setUploading] = useState({});

  const update = (key, value) => setMedia((prev) => ({ ...prev, [key]: value }));

  const handleImageUpload = async (key, file) => {
    if (!file) {
      update(key, null);
      return;
    }

    try {
      setUploading(prev => ({ ...prev, [key]: true }));

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', `taskkash/marketplace/${key}`);

      const response = await fetch('/api/upload/marketplace-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.url) {
        update(key, data.url);
      } else {
        console.error('Upload failed:', data);
        alert(data.error || 'Failed to upload image. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(prev => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="space-y-5">
      <div className="px-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ImageDropzone 
          label="Brand Logo" 
          hint="PNG/SVG, 512x512" 
          icon={ImageIcon} 
          file={media.logo} 
          onChange={(v) => handleImageUpload("logo", v)} 
          uploading={uploading.logo}
        />
        <ImageDropzone 
          label="Banner Image" 
          hint="JPG/PNG, 1600x600" 
          icon={ImageIcon} 
          file={media.banner} 
          onChange={(v) => handleImageUpload("banner", v)} 
          uploading={uploading.banner}
        />
      </div>
      <div className="px-4">
        <ImageDropzone 
          label="Gallery Images" 
          hint="Drop multiple images or click to browse" 
          icon={Upload} 
          file={media.gallery} 
          onChange={(v) => handleImageUpload("gallery", v)} 
          tall 
          uploading={uploading.gallery}
        />
      </div>
      <div className="px-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <UrlInput 
          label="Video URL" 
          hint="Enter video URL (YouTube, Vimeo, etc.)" 
          icon={Film} 
          value={media.video} 
          onChange={(v) => update("video", v)} 
        />
        <UrlInput 
          label="Whitepaper URL" 
          hint="Enter PDF document URL" 
          icon={FileText} 
          value={media.whitepaper} 
          onChange={(v) => update("whitepaper", v)} 
        />
        <UrlInput 
          label="Attachments URL" 
          hint="Enter attachments URL" 
          icon={Upload} 
          value={media.attachments} 
          onChange={(v) => update("attachments", v)} 
        />
      </div>
    </div>
  );
}
