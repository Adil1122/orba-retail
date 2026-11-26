'use client';

import React from 'react';
import { ResponsiveViewport } from '@/components/layout/ResponsiveViewport';

export default function ChatsPage() {
  return (
    <ResponsiveViewport
      moduleName="App"
      moduleProps={{ role: 'owner', page: 'chats' }}
      title="WhatsApp Business Chats · ZYRO Retail POS"
    />
  );
}
