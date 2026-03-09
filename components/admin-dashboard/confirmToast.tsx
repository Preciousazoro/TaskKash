import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';

interface ConfirmToastOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
  confirmButtonVariant?: 'default' | 'destructive' | 'secondary' | 'outline' | 'ghost';
}

export function confirmToast({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  confirmButtonVariant = 'default'
}: ConfirmToastOptions) {
  return new Promise<void>((resolve) => {
    const toastId = toast(
      <div className="bg-card border border-border rounded-lg shadow-lg p-6 min-w-[320px] max-w-[400px]">
        <div className="font-semibold text-foreground mb-3 text-lg">{title}</div>
        {message && (
          <div className="text-sm text-muted-foreground mb-6 leading-relaxed">{message}</div>
        )}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.dismiss(toastId);
              resolve();
            }}
            className="flex-1 hover:bg-muted transition-colors"
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmButtonVariant}
            size="sm"
            onClick={async () => {
              // Show loading state
              toast.update(toastId, {
                render: (
                  <div className="bg-card border border-border rounded-lg shadow-lg p-6 min-w-[320px] max-w-[400px] flex items-center justify-center">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                      <span className="text-foreground">Processing...</span>
                    </div>
                  </div>
                ),
                type: 'default',
                isLoading: true,
              });
              
              try {
                await onConfirm();
                toast.update(toastId, {
                  render: 'Action completed successfully',
                  type: 'success',
                  isLoading: false,
                  autoClose: 3000,
                });
              } catch (error) {
                console.error('Action failed:', error);
                toast.update(toastId, {
                  render: 'Action failed. Please try again.',
                  type: 'error',
                  isLoading: false,
                  autoClose: 5000,
                });
              }
              resolve();
            }}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>,
      {
        autoClose: false,
        className: 'p-0',
        closeButton: false,
        closeOnClick: false,
        style: {
          background: 'transparent',
          boxShadow: 'none',
        }
      }
    );
  });
}
