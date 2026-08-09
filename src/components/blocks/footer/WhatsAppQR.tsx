"use client";

import { QRCodeSVG } from "qrcode.react";
import React from "react";

const CHANNEL_URL = "https://whatsapp.com/channel/0029Vaqul3WC6ZvanAX0DY06";

interface WhatsAppQRProps {
  size: number;
  url?: string;
}

export const WhatsAppQR: React.FC<WhatsAppQRProps> = ({ size, url = CHANNEL_URL }) => {
  return (
    <div className="bg-white rounded-lg p-[7px] inline-flex">
      <QRCodeSVG
        value={url}
        size={size}
        bgColor="#ffffff"
        fgColor="var(--color-navy)"
        level="L"
        marginSize={1}
      />
    </div>
  );
};
