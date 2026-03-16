import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';

interface ConfirmToastOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
  confirmButtonVariant?: 'default' | 'destructive' | 'secondary' | 'outline' | 'ghost';
  successMessage?: string; // Allow custom success messages
}

export function confirmToast({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  confirmButtonVariant = 'default',
  successMessage
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
                // Dismiss the current toast and create a new one with autoClose
                toast.dismiss(toastId);
                toast.success(
                  <div className="bg-card border border-border rounded-lg shadow-lg p-6 min-w-[320px] max-w-[400px]">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{successMessage || 'Action completed successfully'}</div>
                      </div>
                    </div>
                  </div>,
                  {
                    autoClose: 3000,
                    closeButton: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    style: {
                      background: 'transparent',
                      boxShadow: 'none',
                    }
                  }
                );
              } catch (error) {
                console.error('Action failed:', error);
                // Dismiss the current toast and create a new error toast
                toast.dismiss(toastId);
                toast.error(
                  <div className="bg-card border border-border rounded-lg shadow-lg p-6 min-w-[320px] max-w-[400px]">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">Action failed. Please try again.</div>
                      </div>
                    </div>
                  </div>,
                  {
                    autoClose: 5000,
                    closeButton: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    style: {
                      background: 'transparent',
                      boxShadow: 'none',
                    }
                  }
                );
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
