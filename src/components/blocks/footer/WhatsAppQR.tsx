"use client";

import { QRCodeSVG } from "qrcode.react";
import React from "react";

const CHANNEL_URL = "https://whatsapp.com/channel/0029Vaqul3WC6ZvanAX0DY06";

interface WhatsAppQRProps {
  size: number;
}

export const WhatsAppQR: React.FC<WhatsAppQRProps> = ({ size }) => {
  return (
    <div className="bg-white rounded-lg p-[7px] inline-flex">
      <QRCodeSVG
        value={CHANNEL_URL}
        size={size}
        bgColor="#ffffff"
        fgColor="#7C3AED"
        level="M"
        marginSize={1}
      />
    </div>
  );
};
