import React from "react";
import { Upload, Image as ImageIcon, Film, FileText, X } from "lucide-react";

function Dropzone({ label, hint, icon: Icon, file, onChange, tall }) {
  return (
    <div>
      <span className="text-xs font-semibold text-muted-foreground mb-2 block">{label}</span>
      <label
        className={`flex flex-col items-center justify-center gap-2 border border-dashed border-border rounded-xl cursor-pointer hover:border-purple-500/40 hover:bg-muted/20 transition-colors ${
          tall ? "h-32" : "h-24"
        }`}
      >
        <input type="file" className="hidden" onChange={(e) => onChange(e.target.files[0]?.name)} />
        {file ? (
          <div className="flex items-center gap-2 px-3">
            <Icon size={16} className="text-green-500" />
            <span className="text-xs text-foreground truncate max-w-[160px]">{file}</span>
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

export default function MediaUploader({ media, setMedia }) {
  const update = (key, value) => setMedia((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-5">
      <div className="px-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Dropzone label="Brand Logo" hint="PNG/SVG, 512x512" icon={ImageIcon} file={media.logo} onChange={(v) => update("logo", v)} />
        <Dropzone label="Banner Image" hint="JPG/PNG, 1600x600" icon={ImageIcon} file={media.banner} onChange={(v) => update("banner", v)} />
      </div>
      <div className="px-4">
        <Dropzone label="Gallery Images" hint="Drop multiple images or click to browse" icon={Upload} file={media.gallery} onChange={(v) => update("gallery", v)} tall />
      </div>
      <div className="px-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Dropzone label="Video" hint="MP4, max 50MB" icon={Film} file={media.video} onChange={(v) => update("video", v)} />
        <Dropzone label="Whitepaper (PDF)" hint="PDF only" icon={FileText} file={media.whitepaper} onChange={(v) => update("whitepaper", v)} />
        <Dropzone label="Attachments" hint="Any file type" icon={Upload} file={media.attachments} onChange={(v) => update("attachments", v)} />
      </div>
    </div>
  );
}
