'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { uploadBusinessImage, deleteBusinessImage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  businessId: string;
  urls: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  aspect?: 'square' | 'video';
}

export function ImageUploader({
  businessId,
  urls,
  onChange,
  maxFiles = 1,
  aspect = 'square',
}: ImageUploaderProps) {
  const { firebaseApp } = useFirebase();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || !firebaseApp) return;
    const remainingSlots = maxFiles - urls.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    setIsUploading(true);
    try {
      const uploaded = await Promise.all(
        filesToUpload.map((file) => uploadBusinessImage(firebaseApp, businessId, file))
      );
      onChange([...urls, ...uploaded]);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message || 'Could not upload the image.',
      });
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = async (url: string) => {
    onChange(urls.filter((u) => u !== url));
    if (firebaseApp) {
      deleteBusinessImage(firebaseApp, url).catch(() => {
        // Best-effort: the file may already be gone, or rules may block it. The
        // reference to it is removed from the business doc regardless.
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {urls.map((url) => (
          <div
            key={url}
            className={cn(
              'relative overflow-hidden rounded-md border bg-muted',
              aspect === 'square' ? 'h-24 w-24' : 'h-24 w-40'
            )}
          >
            <Image src={url} alt="Uploaded" fill className="object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(url)}
              className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {urls.length < maxFiles && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className={cn(
              'flex flex-col items-center justify-center gap-1 rounded-md border border-dashed text-muted-foreground hover:border-primary hover:text-primary',
              aspect === 'square' ? 'h-24 w-24' : 'h-24 w-40'
            )}
          >
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span className="text-xs">Upload</span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={maxFiles > 1}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-xs text-muted-foreground">
        JPG or PNG, up to 5MB each. {urls.length}/{maxFiles} used.
      </p>
    </div>
  );
}
