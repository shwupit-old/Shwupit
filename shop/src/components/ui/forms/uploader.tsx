import type { Attachment } from '@/types';
import cn from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { useMutation } from 'react-query';
import Image from '@/components/ui/image';
import { CloseIcon } from '@/components/icons/close-icon';
import Button from '@/components/ui/button';
import { SpinnerIcon } from '@/components/icons/spinner-icon';
import { PlusIcon } from '@/components/icons/plus-icon';
import { HttpClient } from '@/data/client/http-client';
import toast from 'react-hot-toast';

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
}: any) {
  const [attachments, setAttachments] = useState<Attachment[] | null>(
    getDefaultValues(value)
  );

  useEffect(() => {
    setAttachments(getDefaultValues(value));
  }, [value]);

  const { mutate, isLoading } = useMutation(
    async (files: File[]) => {
      const response = await HttpClient.uploadAttachments(files);
      console.log('Upload response:', response); // Check this log
      return response.map((file) => ({
        ...file,
        original: file.imagePath,
      }));
    },
    {
      onSuccess: (response) => {
        const data = multiple ? response : response[0];
        onChange(data);
        setAttachments(response);
      },
      onError: (error) => {
        console.error(error);
        toast.error('Failed to upload image. Please try again.');
      },
    }
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      mutate(acceptedFiles);
    },
    [mutate]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] } as Accept,
    multiple,
    onDrop,
  });

  function remove(id: string) {
    if (!attachments) return;
    const newAttachments = attachments.filter((attachment) => attachment.id !== id);
    if (!newAttachments.length) {
      setAttachments(null);
      onChange(null);
      return;
    }
    setAttachments(newAttachments);
    const data = multiple ? newAttachments : newAttachments[0];
    onChange(data);
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      <div
        {...getRootProps({
          className: cn(
            'relative border-dashed border-2 border-light-500 dark:border-dark-600 text-center flex flex-col justify-center hover:text-black dark:hover:text-light items-center cursor-pointer focus:border-accent-400 focus:outline-none',
            {
              'h-25 w-20 rounded-md shrink-0': multiple === true,
              'h-40 w-full rounded': multiple === false,
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
                    {original ? (
                      <img alt="Avatar" src={original} className="object-scale-down" />
                    ) : (
                      'Upload Your Profile Picture'
                    )}
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
            <SpinnerIcon className="h-auto w-5 animate-spin text-brand" /> {multiple !== true && 'Loading...'}
          </span>
        )}
      </div>
      {Array.isArray(attachments) &&
        multiple === true &&
        attachments.map(({ id, original }) => (
          <div key={id} className="group relative h-20 w-20 overflow-hidden rounded-md">
            <div className="relative h-full w-full overflow-hidden rounded-md">
              {original ? (
                <img alt="Attachment" src={original} className="object-cover" />
              ) : (
                <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
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