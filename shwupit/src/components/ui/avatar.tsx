"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import { twMerge } from "tailwind-merge";
import { UserIcon } from "@/components/icons/user-icon"; 

const classes = {
  base: "inline-flex items-center justify-center flex-shrink-0 border text-accent border-border-100 bg-accent/10 overflow-hidden relative",
  size: {
    sm: "h-8 w-8", 
    DEFAULT: "h-6 w-6", 
    lg: "h-12 w-12", // 48px
    xl: "h-14 w-14", // 56px
  },
  fontSize: {
    sm: "text-xs",
    DEFAULT: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  },
  rounded: {
    none: "rounded-none",
    sm: "rounded",
    md: "rounded-xl",
    lg: "rounded-2xl",
    full: "rounded-full",
  },
};

type AvatarProps = {
  src?: string;
  size?: keyof typeof classes.size;
  customSize?: string;
  rounded?: keyof typeof classes.rounded;
  onClick?: () => void;
  className?: string;
};

const CHECK_VALID_CUSTOM_SIZE = /(\d*px)?/g;

function getInitials(firstName: string, lastName: string) {
  const initials = (firstName[0] || "") + (lastName[0] || "");
  return initials.toUpperCase();
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & AvatarProps
>(
  (
    {
      src,
      size = "DEFAULT",
      customSize,
      rounded = "full",
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const [isError, setError] = React.useState(false);
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [profilePictureURL, setProfilePictureURL] = React.useState("");

    React.useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.getSession();
          if (sessionError) throw sessionError;

          const user = sessionData?.session?.user;
          if (!user) throw new Error("Not authenticated");

          const { data, error } = await supabase
            .from("profiles")
            .select("first_name, last_name, profile_picture_url")
            .eq("id", user.id)
            .single();

          if (error) throw error;

          setFirstName(data.first_name);
          setLastName(data.last_name);
          setProfilePictureURL(data.profile_picture_url);

          const channel = supabase
            .channel("custom-all-channel")
            .on(
              "postgres_changes",
              {
                event: "UPDATE",
                schema: "public",
                table: "profiles",
                filter: `id=eq.${user.id}`,
              },
              (payload: any) => {
                setProfilePictureURL(payload.new.profile_picture_url);
                setFirstName(payload.new.first_name);
                setLastName(payload.new.last_name);
              }
            )
            .subscribe();

          return () => {
            supabase.removeChannel(channel);
          };
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };

      fetchUserProfile();
    }, []);

    // Check for valid custom size
    if (customSize?.match(CHECK_VALID_CUSTOM_SIZE)) {
      const checkedCustomSizeValue = customSize.match(CHECK_VALID_CUSTOM_SIZE);
      if (!checkedCustomSizeValue || !checkedCustomSizeValue[0]) {
        console.warn(
          'customSize prop value is not valid. Please set customSize prop like -> customSize="50px"'
        );
      }
    }

    const imageSrc = src || profilePictureURL;

    return (
      <AvatarPrimitive.Root
        ref={ref}
        className={twMerge(
          cn(
            classes.base,
            classes.rounded[rounded],
            onClick && "cursor-pointer",
            className
          ),
          customSize ? `h-[${customSize}] w-[${customSize}]` : classes.size[size]
        )}
        {...props}
      >
        {!isError && imageSrc ? (
          <AvatarPrimitive.Image
            alt={`${firstName} ${lastName}`}
            src={imageSrc}
            className="object-cover object-center"
            onError={() => setError(true)}
          />
        ) : (
          <AvatarFallback className="text-current">
            <UserIcon className="h-full w-full" />
          </AvatarFallback>
        )}
      </AvatarPrimitive.Root>
    );
  }
);
Avatar.displayName = AvatarPrimitive.Root.displayName;

export { Avatar };

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  >
    <UserIcon className="h-full w-full" />
  </AvatarPrimitive.Fallback>
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { AvatarImage, AvatarFallback };