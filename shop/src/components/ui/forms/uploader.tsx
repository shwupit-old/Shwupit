import type { Attachment } from '@/types';
import cn from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from '@/components/ui/image';
import { CloseIcon } from '@/components/icons/close-icon';
import Button from '@/components/ui/button';
import { SpinnerIcon } from '@/components/icons/spinner-icon';
import { PlusIcon } from '@/components/icons/plus-icon';
import { supabase } from '@/data/utils/supabaseClient';

function getDefaultValues(attachment: Attachment[] | null) {
  if (!attachment) return null;
  return Array.isArray(attachment) ? attachment : [attachment];
}

export default function Uploader({
  onChange,
  value,
  name,
  onBlur,
  multiple = true,
  userId,
}: any) {
  let [attachments, setAttachments] = useState<Attachment[] | null>(
    getDefaultValues(value)
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setAttachments(getDefaultValues(value));
  }, [value]);

  const uploadToSupabase = async (files: File[]) => {
    const uploadedFiles: Attachment[] = [];
    for (const file of files) {
      const { data, error } = await supabase.storage
        .from('images')
        .upload(`profile_picture/${userId}/${file.name}`, file);

      if (error) {
        console.error("Supabase upload error:", error.message);
        throw error;
      }

      if (data) {
        const { data: publicUrlData } = supabase.storage
          .from('images')
          .getPublicUrl(data.path);
        const publicUrl = publicUrlData.publicUrl;

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
        const data = multiple ? uploadedFiles : uploadedFiles[0];
        onChange(data);
        setAttachments(uploadedFiles);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [multiple, onChange, userId]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    multiple,
    onDrop,
  });

  function remove(id: string) {
    if (!attachments) return;
    const newAttachments = attachments.filter(
      (attachment) => attachment.id !== id
    );
    if (!newAttachments.length) {
      setAttachments(null);
      onChange(null);
      return;
    }
    setAttachments(newAttachments);
    const data = multiple ? newAttachments : newAttachments[0];
    onChange(data);

    supabase.storage.from('images').remove([id]).catch(console.error);
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      <div
        {...getRootProps({
          className: cn(
            'relative border-dashed border-2 border-light-500 dark:border-dark-600 text-center flex flex-col justify-center hover:text-black dark:hover:text-light items-center cursor-pointer focus:border-accent-400 focus:outline-none',
            {
              'h-20 w-20 rounded-md shrink-0': multiple === true,
              'h-36 w-full rounded': multiple === false,
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
        {multiple !== true
          ? Array.isArray(attachments)
            ? attachments.map(({ id, original }) => (
                <div key={id}>
                  <div className="relative h-20 w-20 overflow-hidden rounded-full">
                    <Image
                      alt="Avatar"
                      src={original}
                      fill
                      className="object-scale-down"
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
              ))
            : 'Upload Your Profile Picture'
          : !isLoading && <PlusIcon className="h-5 w-5" />}

        {isLoading && (
          <span className="mt-2.5 flex items-center gap-1 font-medium text-light-500">
            <SpinnerIcon className="h-auto w-5 animate-spin text-brand" />{' '}
            {multiple !== true && 'Loading...'}
          </span>
        )}
      </div>
      {Array.isArray(attachments) &&
        multiple === true &&
        attachments.map(({ id, original }) => (
          <div
            key={id}
            className="group relative h-20 w-20 overflow-hidden rounded-md"
          >
            <div className="relative h-full w-full overflow-hidden rounded-md">
              <Image
                alt="Attachment"
                src={original}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute right-0 top-0 flex h-full w-full items-center justify-center bg-dark/60 opacity-0 transition-all group-hover:opacity-100">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  remove(id);
                }}
                variant="icon"
                className="h-9 w-9 rounded-full bg-dark/60"
              >
                <CloseIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
}