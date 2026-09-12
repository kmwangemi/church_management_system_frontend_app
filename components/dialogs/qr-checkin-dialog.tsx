'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, QrCode, Settings, Smartphone } from 'lucide-react';
import { useState } from 'react';

interface QRCheckinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QRCheckinDialog({ open, onOpenChange }: QRCheckinDialogProps) {
  const [qrSettings, setQrSettings] = useState({
    eventName: 'Sunday Morning Service',
    checkInUrl: 'https://church.com/checkin/sunday-service',
    expiryTime: '2',
  });

  const generateQR = () => {
    console.log('Generating QR code with settings:', qrSettings);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Check-in System
          </DialogTitle>
          <DialogDescription>
            Generate QR codes for easy member check-in
          </DialogDescription>
        </DialogHeader>
        <Tabs className="w-full" defaultValue="generate">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate">Generate QR</TabsTrigger>
            <TabsTrigger value="active">Active Codes</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent className="space-y-4" value="generate">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>QR Code Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventName">Event Name</Label>
                    <Input
                      id="eventName"
                      onChange={(e) =>
                        setQrSettings({
                          ...qrSettings,
                          eventName: e.target.value,
                        })
                      }
                      placeholder="Sunday Morning Service"
                      value={qrSettings.eventName}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkInUrl">Check-in URL</Label>
                    <Input
                      id="checkInUrl"
                      onChange={(e) =>
                        setQrSettings({
                          ...qrSettings,
                          checkInUrl: e.target.value,
                        })
                      }
                      placeholder="https://church.com/checkin/..."
                      value={qrSettings.checkInUrl}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryTime">Expiry Time (hours)</Label>
                    <Input
                      id="expiryTime"
                      onChange={(e) =>
                        setQrSettings({
                          ...qrSettings,
                          expiryTime: e.target.value,
                        })
                      }
                      placeholder="2"
                      type="number"
                      value={qrSettings.expiryTime}
                    />
                  </div>
                  <Button className="w-full" onClick={generateQR}>
                    <QrCode className="mr-2 h-4 w-4" />
                    Generate QR Code
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>QR Code Preview</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <div className="flex h-48 w-48 items-center justify-center rounded-lg border-2 border-border border-dashed bg-muted">
                    <div className="text-center">
                      <QrCode className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground text-sm">
                        QR Code will appear here
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{qrSettings.eventName}</p>
                    <p className="text-muted-foreground text-sm">Tap to check in</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download QR Code
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent className="space-y-4" value="active">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Active QR Codes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">Sunday Morning Service</p>
                      <p className="text-muted-foreground text-sm">
                        Expires in 1 hour 23 minutes
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-green-600 text-sm">
                        23 check-ins
                      </span>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">Wednesday Bible Study</p>
                      <p className="text-muted-foreground text-sm">
                        Expires in 3 hours 45 minutes
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-green-600 text-sm">
                        8 check-ins
                      </span>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent className="space-y-4" value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  QR Check-in Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Expiry Time</Label>
                  <Input placeholder="2 hours" />
                </div>
                <div className="space-y-2">
                  <Label>Base Check-in URL</Label>
                  <Input placeholder="https://church.com/checkin/" />
                </div>
                <div className="space-y-2">
                  <Label>QR Code Size</Label>
                  <Input placeholder="256x256 pixels" />
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
