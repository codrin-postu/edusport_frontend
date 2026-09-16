"use client";

import type { Announcement as AnnouncementData } from "@/lib/strapi-announcement";

import { AnnouncementCard } from "./AnnouncementCard";
import { AnnouncementModal } from "./AnnouncementModal";

interface AnnouncementProps {
  announcement: AnnouncementData;
}

/**
 * Picks the treatment the editor chose for this announcement. The server has
 * already decided *which* announcement to show; this only decides *how*.
 */
export function Announcement({ announcement }: AnnouncementProps) {
  return announcement.format === "modal" ? (
    <AnnouncementModal announcement={announcement} />
  ) : (
    <AnnouncementCard announcement={announcement} />
  );
}
