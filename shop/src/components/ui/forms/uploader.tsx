import type { Attachment } from '@/types';
import cn from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { CloseIcon } from '@/components/icons/close-icon';
import Button from '@/components/ui/button';
import { SpinnerIcon } from '@/components/icons/spinner-icon';
import { supabase } from '@/data/utils/supabaseClient';
import Compressor from 'compressorjs';

function getDefaultValues(attachment: Attachment[] | null): Attachment[] | null {
  if (!attachment) return null;
  return Array.isArray(attachment) ? attachment : [attachment];
}

function getInitialAttachment(url: string): Attachment {
  return {
    id: 'initial',
    original: url,
    thumbnail: url,
    imagePath: 'initial',
  };
}

interface UploaderProps {
  onChange: (attachments: Attachment[] | null) => void;
  value: Attachment[] | null;
  name: string;
  onBlur: () => void;
  multiple?: boolean;
  userId: string;
  initialUrl?: string;
}

export default function Uploader({
  onChange,
  value,
  name,
  onBlur,
  multiple = true,
  userId,
  initialUrl,
}: UploaderProps) {
  const [attachments, setAttachments] = useState<Attachment[] | null>(
    initialUrl ? [getInitialAttachment(initialUrl)] : getDefaultValues(value)
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialUrl) {
      setAttachments([getInitialAttachment(initialUrl)]);
    } else if (value && value.length > 0) {
      setAttachments(getDefaultValues(value));
    } else {
      setAttachments(null);
    }
  }, [value, initialUrl]);

  const compressImage = (file: File): Promise<File> =>
    new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.6,
        success(result) {
          const compressedFile = new File([result], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        error(err) {
          reject(err);
        },
      });
    });

  const uploadToSupabase = async (files: File[]) => {
    const uploadedFiles: Attachment[] = [];
    for (const file of files) {
      const compressedFile = await compressImage(file);
      const { data, error } = await supabase.storage
        .from('images')
        .upload(`profile_picture/${userId}/${compressedFile.name}`, compressedFile);

      if (error) {
        console.error("Supabase upload error:", error.message);
        throw error;
      }

      if (data) {
        const { publicUrl } = supabase.storage.from('images').getPublicUrl(data.path).data;

        uploadedFiles.push({
          id: data.path,
          original: publicUrl,
          thumbnail: publicUrl,
          imagePath: data.path,
        });
      }
    }
    return uploadedFiles;
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsLoading(true);
      try {
        const uploadedFiles = await uploadToSupabase(acceptedFiles);
        onChange(uploadedFiles);
        setAttachments(uploadedFiles);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [onChange, userId]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    multiple,
    onDrop,
  });

  async function remove(id: string) {
    if (!attachments) return;
    const newAttachments = attachments.filter(
      (attachment) => attachment.id !== id
    );
    setAttachments(newAttachments.length ? newAttachments : null);
    onChange(newAttachments.length ? newAttachments : null);

    try {
      const { error } = await supabase.storage.from('images').remove([id]);
      if (error) {
        console.error("Error removing file from Supabase storage:", error.message);
      }
    } catch (error) {
      console.error("Error removing file:", error);
    }
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      <div
        {...getRootProps({
          className: cn(
            'relative border-dashed border-2 border-light-500 dark:border-dark-600 text-center flex flex-col justify-center hover:text-black dark:hover:text-light items-center cursor-pointer focus:border-accent-400 focus:outline-none',
            {
              'h-36 w-full': multiple === false,
            }
          ),
        })}
      >
        <input
          {...getInputProps({
            name,
            onBlur,
          })}
        />
        {!isLoading && (!attachments || attachments.length === 0) && (
          <span>Upload Your Profile Picture</span>
        )}
        {attachments && attachments.length > 0 && !isLoading &&
          attachments.map(({ id, original }) => (
            <div key={id}>
              <div className="relative h-20 w-20 overflow-hidden rounded-full">
                <Image
                  alt="Avatar"
                  src={original}
                  layout="fill"
                  objectFit="cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="rounded-full"
                />
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  remove(id);
                }}
                variant="icon"
                className="absolute right-0 top-0 p-3"
              >
                <CloseIcon className="h-4 w-4 3xl:h-5 3xl:w-5" />
              </Button>
            </div>
          ))}
        {isLoading && (
          <span className="mt-2.5 flex items-center gap-1 font-medium text-light-500">
            <SpinnerIcon className="h-auto w-5 animate-spin text-brand" />{' '}
            Loading...
          </span>
        )}
      </div>
    </div>
  );
}