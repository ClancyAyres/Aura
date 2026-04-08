import { AvatarConfig } from "@/schemas/resume";
import Image from "next/image";
import React from "react";

export default function Avatar({
  avatar,
  name,
}: {
  avatar?: Partial<AvatarConfig>;
  name: string;
}) {
  if (!avatar?.url) return null;
  return (
    <img
      src={avatar.url}
      alt={name}
      className="w-24 h-24 rounded-full object-cover"
    />
  );
}
